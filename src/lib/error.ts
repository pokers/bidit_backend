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
    ErrorUserNotFound = 'Could not find User',
    ErrorItemNotFound = 'Could not find item',
    ErrorInvalidString = 'Invalid String, it might be zero length',
    ErrorExceedStringLength = 'Invalid String, it might be longer string than maxium length',
    ErrorInvalidPageInfo = 'Invalid page number or size.',
    ErrorNotMatchedArticle = 'Invalid parent comment ID or article ID',
    ErrorInvalidToken = 'Invalid token, it can be expired or wrong token',
    ErrorRequireAddUser = 'Cannot find User information, Please add user first.',
    ErrorNotFoundSocialUserInfo = 'Cannot find Social User Info.',
    ErrorCouldNotAdd = 'Could not add item',
    ErrorDuplicatedItem = 'Could not completed due to duplicated item'
}

export const ErrorNotSupportedParameters = ()=>{
    return new cError(400, ErrMessage.NotSupportedParameters);
}

export const ErrorModuleNotFound = ()=>{
    return new cError(500, ErrMessage.ModuleNotFound);
}

export const ErrorCouldNotAdd = ()=>{
    return new cError(500, ErrMessage.ErrorCouldNotAdd);
}

export const ErrorInvalidBodyParameter = ()=>{
    return new cError(400, ErrMessage.ErrorInvalidBodyParameter);
}

export const ErrorNotMatchedPasswd = ()=>{
    return new cError(403, ErrMessage.ErrorNotMatchedPasswd);
}

export const ErrorUserNotFound = ()=>{
    return new cError(404, ErrMessage.ErrorUserNotFound);
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

export const ErrorInvalidToken = ()=>{
    return new cError(401, ErrMessage.ErrorInvalidToken)
}

export const ErrorAxiosException = (status:number, message:ErrMessage|string)=>{
    return new cError(status, message)
}

export const ErrorRequireAddUser = ()=>{
    return new cError(404, ErrMessage.ErrorRequireAddUser);
}

export const ErrorNotFoundSocialUserInfo = ()=>{
    return new cError(404, ErrMessage.ErrorNotFoundSocialUserInfo);
}

export const ErrorDuplicatedItem = ()=>{
    return new cError(409, ErrMessage.ErrorDuplicatedItem);
}