import Container, { Service } from "typedi";
import { log, cError, ErrorInvalidToken, AppleAuth } from '../lib'
import { KakaoResult, KakaoTokenInfo, KakaoUserInfo, AppleIdTokenType } from "../lib";
import { AuthResult, UserInfoResult } from '../types'
import { ServiceBase } from './serviceBase'


@Service()
class AuthService extends ServiceBase {
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

    async appleAuthenticate(token:string):Promise<AuthResult>{
        try{
            const appleTokenType:AppleIdTokenType = await Container.get(AppleAuth).verifyIdToken(token);
            log.info('appleAuthenticate : ', appleTokenType);
            if(!appleTokenType){
                throw ErrorInvalidToken();
            }
            const result:AuthResult = {
                result: true,
                appleAccountSub: appleTokenType.sub,
                authType: 'apple'
            }
            return result;
        }catch(e){
            log.error('exception> appleAuthenticate : ', e);
            throw ErrorInvalidToken();
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
                log.error(`tokenType : ${tokenType} ${token} ${vendor}`);
                return result;
            }
            if(vendor === 'kakao' || !vendor){
                return await this.kakaoAuthenticate(token);
            }
            if(vendor === 'apple'){
                return await this.appleAuthenticate(token);
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
            if(vendor === 'apple'){
                const appleTokenType:AppleIdTokenType = await Container.get(AppleAuth).verifyIdToken(token);
                result.result = true;
                result.data = appleTokenType;
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