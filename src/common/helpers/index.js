import crypto from 'node:crypto';
import ConfigService from '../../env';

const { encryptAlgorithm, encryptKey } = ConfigService.encryptConfig();

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(encryptAlgorithm, encryptKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted;
};

export const decrypt = (encryptedText) => {
    const iv = Buffer.from(encryptedText.substring(0, 32), 'hex');
    const encryptedData = encryptedText.substring(32);

    const decipher = crypto.createDecipheriv(encryptAlgorithm, encryptKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
