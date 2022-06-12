import { log, ErrorAxiosException } from './'
import { Service } from "typedi";
import { kakaoEnv } from '../config';
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { Maybe } from '../types';
import querystring from 'querystring'
import url from 'url'
import FormData from 'form-data';

export type KakaoProfile = {
    nkckname: Maybe<string>;
    thumbnail_image_url: Maybe<string>;
    profile_image_url: Maybe<string>;
    is_default_image: Maybe<boolean>;
}
export type KakaoAccount = {
    id?:Maybe<number>;
    status?:Maybe<number>;
    userId?:Maybe<number>;
    profile_needs_agreement: Maybe<boolean>;
    profile_nickname_needs_agreement: Maybe<boolean>;
    profile_image_needs_agreement: Maybe<boolean>;
    profile: Maybe<KakaoProfile>;
    name_needs_agreement: Maybe<boolean>;
    name: Maybe<string>;
    email_needs_agreement: Maybe<boolean>;
    is_email_valid: Maybe<boolean>;
    is_email_verified: Maybe<boolean>;
    email: Maybe<string>;
    age_range: Maybe<string>;
    birthyear: Maybe<string>;   // YYYY
    birthday: Maybe<string>;    // MMDD
    birthday_type: Maybe<string>;   // SORAL(양력), LUNAR(음력)
    gender: Maybe<string>;
    phone_number: Maybe<string>;
    ci_needs_agreement: Maybe<boolean>;
    ci: Maybe<string>;
    ci_authenticated_at: Maybe<string>;
    createdAt?:string;
    updatedAt?:string;
    deletedAt?:string;
    description?:string;
}
export type KakaoUserInfo = {
    id:number;
    has_signed_up: Maybe<string>;
    connected_at: Maybe<string>;
    synched_at: Maybe<string>;
    properties: Maybe<JSON>;
    kakao_account: Maybe<KakaoAccount>;
}

export type KakaoResult<T> = {
    status: number;
    data: Maybe<T>;
}

export type KakaoTokenInfo = {
    id: number;
    expires_in: number;
    add_ip: number
}
@Service()
class KakaoAPI {
    constructor(){
    }

    async getTokenInfo(token:string):Promise<KakaoResult<KakaoTokenInfo>>{
        try{
            const URL = 'https://kapi.kakao.com/v1/user/access_token_info'
            const config:AxiosRequestConfig = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const result = await axios.get(URL, config);
            log.info('getTokenInfo statusCode : ', result.status);
            log.info('getTokenInfo data : ', result.data);
            
            return {status: result.status, data: result.data};
        }catch(e){
            log.error('exception > getTokenInfo : ', e);
            if(e instanceof AxiosError && e.response){
                throw ErrorAxiosException(e.response.status, e.response.data? e.response.data:e.response.statusText);
            }
            throw e;
        }
    }

    async getUserInfo(token:string):Promise<KakaoResult<KakaoUserInfo>>{
        try{
            const URL = 'https://kapi.kakao.com/v2/user/me'
            const config:AxiosRequestConfig = {
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
            }
            const result = await axios.get(URL, config);
            log.info('getUserInfo statusCode : ', result.status);
            log.info('getUserInfo data : ', result.data);
            
            return {status: result.status, data: result.data};
        }catch(e){
            log.error('exception > getTokenInfo : ', e);
            if(e instanceof AxiosError && e.response){
                throw ErrorAxiosException(e.response.status, e.response.data? e.response.data:e.response.statusText);
            }
            throw e;
        }
    }
}

export { KakaoAPI }