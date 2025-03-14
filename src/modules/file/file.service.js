import axios from 'axios';

class FileService {
    getFileSizeAndContentType = async (url) => {
        const response = await axios.head(url);

        return {
            size: parseInt(response.headers['content-length'], 10),
            contentType: response.headers['content-type'],
        };
    };

    downloadChunk = async (url, start, end) => {
        const { data } = await axios.get(url, {
            headers: { Range: `bytes=${start}-${end}` },
            responseType: 'arraybuffer',
        });

        return data;
    };
}

export default new FileService();
