import { User, Maybe, AuthResult, UserInfoResult } from '../types';
import { log, ErrorModuleNotFound, ErrorInvalidBodyParameter, ErrorUserNotFound } from '../lib';
import { Service } from 'typedi';
import { ServiceBase } from './serviceBase'
import { Transaction } from '../repository'
import { PenaltyAttributes } from '../repository/model/penalty';

@Service()
class UserService extends ServiceBase {

    async getUser(arg: any, selectionSetList?:string[]): Promise<User>{
        try{
            const { id } = arg;
            if(!this.repositories.getRepository().userRepo){
                throw ErrorModuleNotFound();
            }
            if(!this.repositories.getRepository().penaltyRepo){
                throw ErrorModuleNotFound();
            }
            const user:User = await this.repositories.getRepository().userRepo.getUser(id);
            const penaltyQuery:PenaltyAttributes = {
                userId: id,
                status: 0
            }
            const penalty = await this.repositories.getRepository().penaltyRepo.getUserPenalty(penaltyQuery);
            if(penalty){
                user.penalty = penalty;
            }

            return user
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

    async updateUser(authInfo:AuthResult, arg: any, selectionSetList:string[]):Promise<Maybe<User>>{
        try{
            const { userUpdate } = arg;

            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }
            if(!userUpdate){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().userRepo){
                throw ErrorModuleNotFound();
            }
            const updatedUser = await this.repositories.getRepository().userRepo.updateUser(authInfo.userId, userUpdate);

            return await this.getUser({id:authInfo.userId});
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }

    async updatePushToken(authInfo:AuthResult, arg: any, selectionSetList:string[]):Promise<boolean>{
        try{
            const { pushTokenUpdate } = arg;

            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }
            if(!pushTokenUpdate){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().userRepo){
                throw ErrorModuleNotFound();
            }
            log.info('pushTokenUpdate : ', pushTokenUpdate);
            const pushToken = await this.repositories.getRepository().userRepo.updatePushToken(authInfo.userId, pushTokenUpdate);

            return pushToken? true:false;
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }
}

export { UserService }