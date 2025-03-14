import { decrypt, encrypt } from '../../common/helpers';

class FileController {
    getFile = async (req, res) => {
        const { hashString } = req.params;

        const encryptedData = encrypt('a.txt');
        const decoded = decrypt(encryptedData);

        res.status(200).send({ encryptedData, decoded });
    };
}

export default new FileController();
