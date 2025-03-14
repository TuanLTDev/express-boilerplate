import { InValidHttpResponse, ValidHttpResponse } from '../../common/response';
import FileService from '../../modules/file/file.service';
import { FileSizeUtil } from '../../common/utils/file-size.util';
import ConfigService from '../../env';
import * as fs from 'node:fs';
import axios from 'axios';

class MediaController {
    constructor(fileService) {
        this.fileService = fileService;
    }

    test = async (req, res) => {
        try {
            const { url, name } = req.body[0];
            const { size: fileSize, contentType } = await this.fileService.getFileSizeAndContentType(url);

            const fileExtension = contentType.split('/')[1] || 'json';
            const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
            const fileUrl = `${ConfigService.PREFIX_FILE_URL}${fileName}`;
            const filePath = `${ConfigService.UPLOAD_FILE_DIR}/${fileName}`;

            const fileStream = fs.createWriteStream(filePath);

            const response = await axios.get(url, {
                responseType: 'stream',
            });

            response.data.pipe(res);

            // fileStream.on('finish', () => {
            //     console.log('File downloaded successfully.');
            // });

            // return ValidHttpResponse.toOkResponse({ fileName, fileUrl }).toResponse(res);
        } catch (error) {
            InValidHttpResponse.toBadRequestResponse(
                `Error fetching or converting file: ${error.message}`,
                undefined,
                error.stack,
            ).toResponse(res);
        }
    };

    download = async (req, res) => {
        try {
            const { url, name } = req.body[0];
            const { size: fileSize, contentType } = await this.fileService.getFileSizeAndContentType(url);

            const chunkSize = FileSizeUtil.getOptimalChunkSize(fileSize);
            const chunks = Math.ceil(fileSize / chunkSize);

            const listBuffer = [];
            Array.from({ length: chunks }).map(async (_, i) => {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, fileSize);

                const data = await FileService.downloadChunk(url, start, end);
                listBuffer.push(data);
            });

            res.send(listBuffer);
            return;

            const fileChunks = Promise.all(
                Array.from({ length: chunks }, (_, i) => {
                    const start = i * chunkSize;
                    const end = Math.min(start + chunkSize, fileSize);
                    return FileService.downloadChunk(url, start, end);
                }),
            );

            const fileExtension = contentType.split('/')[1] || 'json';
            const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
            const fileUrl = `${ConfigService.PREFIX_FILE_URL}${fileName}`;
            const filePath = `${ConfigService.UPLOAD_FILE_DIR}/${fileName}`;

            return ValidHttpResponse.toOkResponse({ fileName, fileUrl }).toResponse(res);
        } catch (error) {
            InValidHttpResponse.toBadRequestResponse(
                `Error fetching or converting file: ${error.message}`,
                undefined,
                error.stack,
            ).toResponse(res);
        }
    };
}

export default new MediaController(FileService);
