export class cError extends Error {
    protected statusCode:number;
    constructor(statusCode: number, message?: string){
        super(message);
        this.statusCode = statusCode;
    }

    getStatusCode():number{
        return this.statusCode;
    }
}
export enum ErrMessage {
    NotSupportedParameters = 'passing first and last are not supported',
    ModuleNotFound = 'Module not found',
    ErrorInvalidBodyParameter = 'Missing required parameter',
    ErrorNotMatchedPasswd = 'Please check password',
    ErrorItemNotFound = 'Could not find item',
    ErrorInvalidString = 'Invalid String, it might be zero length',
    ErrorExceedStringLength = 'Invalid String, it might be longer string than maxium length',
    ErrorInvalidPageInfo = 'Invalid page number or size.',
    ErrorNotMatchedArticle = 'Invalid parent comment ID or article ID'
}

export const ErrorNotSupportedParameters = ()=>{
    return new cError(400, ErrMessage.NotSupportedParameters);
}

export const ErrorModuleNotFound = ()=>{
    return new cError(500, ErrMessage.ModuleNotFound);
}

export const ErrorInvalidBodyParameter = ()=>{
    return new cError(400, ErrMessage.ErrorInvalidBodyParameter);
}

export const ErrorNotMatchedPasswd = ()=>{
    return new cError(403, ErrMessage.ErrorNotMatchedPasswd);
}

export const ErrorItemNotFound = ()=>{
    return new cError(404, ErrMessage.ErrorItemNotFound);
}

export const ErrorInvalidString = ()=>{
    return new cError(400, ErrMessage.ErrorInvalidString);
}
export const ErrorExceedStringLength = ()=>{
    return new cError(400, ErrMessage.ErrorExceedStringLength);
}
export const ErrorInvalidPageInfo = ()=>{
    return new cError(400, ErrMessage.ErrorInvalidPageInfo);
}
export const ErrorNotMatchedArticle = ()=>{
    return new cError(400, ErrMessage.ErrorNotMatchedArticle);
}