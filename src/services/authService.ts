import { Service } from "typedi";
import { Repositories } from "../repository";
import { log, cError, ErrorInvalidToken } from '../lib'
import { KakaoAPI, KakaoResult, KakaoTokenInfo, KakaoUserInfo } from "../lib/kakaoAPI";
import { Maybe, User, AuthResult, UserInfoResult } from '../types'


@Service()
class AuthService {
    constructor(private repositories:Repositories, private kakaoAPI:KakaoAPI){

    }

    errorHandler(error: Error|any){
        if(error instanceof cError){
            log.error('statusCode : ', error.getStatusCode());
        }

        return error;
    }
    async kakaoAuthenticate(token:string):Promise<AuthResult>{
        try{
            const authResult:KakaoResult<KakaoTokenInfo> = await this.kakaoAPI.getTokenInfo(token);
            if(authResult.status !== 200 || authResult.data === null){
                throw ErrorInvalidToken();
            }
            const result:AuthResult = {
                result: true,
                kakaoAccountId: authResult.data.id,
                authType: 'kakao'
            }
            return result;
        }catch(e){
            log.error('exception> authenticateUser : ', e);
            throw this.errorHandler(e);
        }
    }

    async kakaoUserInfo(token:string):Promise<KakaoResult<KakaoUserInfo>>{
        try{
            const result:KakaoResult<KakaoUserInfo> = await this.kakaoAPI.getUserInfo(token);
            if(result.status !== 200 || result.data === null){
                throw ErrorInvalidToken();
            }
            return result;
        }catch(e){
            log.error('exception> authenticateUser : ', e);
            throw this.errorHandler(e);
        }
    }

    async authenticateUser(authorization:string):Promise<AuthResult>{
        try{
            const [tokenType, token, vendor] = authorization.split(' ');
            const result:AuthResult = {
                result:false,
                authType: 'none'
            }
            log.info(`tokenType : ${tokenType} ${token} ${vendor}`);
            if(tokenType === undefined || token === undefined){
                return result;
            }
            if(vendor === 'kakao' || !vendor){
                return await this.kakaoAuthenticate(token);
            }

            return result;
        }catch(e){
            log.error('exception> authenticateUser : ', e);
            throw this.errorHandler(e);
        }
    }

    async getSocialUserInfo(authorization:string):Promise<UserInfoResult>{
        try{
            const [tokenType, token, vendor] = authorization.split(' ');
            const result:UserInfoResult = {
                result:false,
                vendor: 'none'
            }
            log.info(`tokenType : ${tokenType} ${token} ${vendor}`);
            if(tokenType === undefined || token === undefined){
                return result;
            }
            if(vendor === 'kakao' || !vendor){
                const kakaoResult:KakaoResult<KakaoUserInfo> = await this.kakaoUserInfo(token);
                result.result = true;
                result.data = kakaoResult.data;
                result.vendor = vendor;
                return result;
            }

            return result;
        }catch(e){
            log.error('exception> authenticateUser : ', e);
            throw this.errorHandler(e);
        }
    }
}

export { AuthService }