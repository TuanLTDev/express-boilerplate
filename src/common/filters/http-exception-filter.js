import { HttpException } from '../exceptions';
import { InValidHttpResponse } from '../response';

export class HttpExceptionFilter {
    filter(err, req, res, next) {
        if (err instanceof HttpException) {
            return new InValidHttpResponse(err.status, err.code, err.message).toResponse(res);
        }
        if (err instanceof Error) {
            console.error(err);
            return InValidHttpResponse.toInternalResponse(err.message).toResponse(res);
        }
        return next();
    }
}
