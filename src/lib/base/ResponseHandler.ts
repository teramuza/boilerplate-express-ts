import { Response } from 'express';
import { HttpStatusCode, HttpStatusCodeType } from '@constant/HTTPCodes';
import { ErrorResponse } from '@types';
import logging from '@util/logging';
import ErrorCodes from '@constant/ErrorCodes';

class ResponseHandler {
    protected successHandler<T = Record<string, any>>(
        res: Response,
        message?: string,
        data?: T,
        status?: HttpStatusCodeType
    ) {
        return res.status(status || HttpStatusCode.OK).json({ message, data });
    }

    protected unauthorizedResponse(res: Response, error?: ErrorResponse) {
        logging.error('unauthorized', error?.code, error?.data);
        return res.status(HttpStatusCode.Unauthorized).json({
            type: 'unauthorized',
            error: error,
        });
    }

    protected forbiddenResponse(res: Response, error?: ErrorResponse) {
        logging.error(error);
        return res.status(HttpStatusCode.Forbidden).json({
            type: 'forbidden',
            error,
        });
    }

    protected badRequestResponse(
        res: Response,
        message?: string,
        errorCode?: number,
        errorInfo?: Record<string, any>
    ) {
        logging.error(`ERROR([${errorCode ?? ErrorCodes.DEFAULT}]): `, errorInfo);
        return res.status(HttpStatusCode.BadRequest).json({
            type: 'bad_request',
            error: {
                message,
                code: errorCode,
                info: errorInfo,
            },
        });
    }

    protected serverErrorResponse(res: Response, error?: any) {
        logging.error('server_error', error);
        return res.status(HttpStatusCode.InternalServerError).json({
            type: 'server_error',
            error,
        });
    }

    protected notFoundResponse(res: Response, message?: string) {
        return res.status(HttpStatusCode.NotFound).json({
            type: 'not_found',
            message,
        });
    }
}

export default ResponseHandler;
