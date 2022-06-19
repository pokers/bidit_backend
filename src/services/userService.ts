import { User, Maybe, AuthResult, UserInfoResult } from '../types';
import { log, ErrorModuleNotFound } from '../lib';
import { Service } from 'typedi';
import { ServiceBase } from './serviceBase'
import { Transaction } from '../repository'

@Service()
class UserService extends ServiceBase {

    async getUser(arg: any, selectionSetList?:string[]): Promise<User>{
        try{
            const { id } = arg;
            if(!this.repositories.getRepository().userRepo){
                throw ErrorModuleNotFound();
            }
            const queryResult = await this.repositories.getRepository().userRepo.getUser(id);
            return queryResult
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }

    async getUserBySocialId(authResult:AuthResult): Promise<Maybe<User>>{
        try{
            if(authResult.authType === 'kakao' && authResult.kakaoAccountId){
                return await this.repositories.getRepository().userRepo.getUserBySocialId(authResult.kakaoAccountId, authResult.authType);
            }
            return null;
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }

    async addUser(userinfo:UserInfoResult, transaction?: Transaction):Promise<Maybe<User>>{
        try{
            const { result, data, vendor } = userinfo;
            if(vendor === 'kakao'){
                return await this.repositories.getRepository().userRepo.addUserBySocialAccount(vendor, data!, transaction);
            }
            return null;
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }
}

export { UserService }