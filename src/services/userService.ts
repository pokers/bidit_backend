import { User, Maybe, AuthResult, UserInfoResult, UserAlarm, Penalty } from '../types';
import { log, ErrorModuleNotFound, ErrorInvalidBodyParameter, ErrorUserNotFound, AppleIdTokenType } from '../lib';
import { Service } from 'typedi';
import { ServiceBase } from './serviceBase'
import { Transaction, RepoObjects } from '../repository'
import { PenaltyAttributes } from '../repository/model/penalty';
import { KakaoUserInfo, UserAlarmAttributes } from '../repository/model';

class UserAdapter {
    static buildUser(user:User){
        return (penalty:Penalty)=>{
            user.penalty = penalty;
            return (userAlarm:UserAlarm)=>{
                user.userAlarm = userAlarm;
                return (sellCount:number)=>{
                    user.counting = {
                        buy:0,
                        sell: sellCount
                    }
                    return (buyCount:number)=>{
                        user.counting!.buy = buyCount;
                        return user;
                    }
                };
            }
        }
    }
}

@Service()
class UserService extends ServiceBase {

    private isValidRepositories(names:string[]){
        names.map(name=>{
            if(!this.repositories.getRepository()[name]){
                throw ErrorModuleNotFound();
            }
        })
    }
    async getUser(arg: any, selectionSetList?:string[]): Promise<User>{
        try{
            const { id } = arg;
            this.isValidRepositories(['userRepo', 'penaltyRepo', 'alarmRepo', 'itemRepo', 'biddingRepo']);

            const queryAttributes:PenaltyAttributes = {
                userId: id,
                status: 0
            }

            const tasks = [];
            tasks.push(this.repositories.getRepository().userRepo.getUser(id));
            tasks.push(this.repositories.getRepository().penaltyRepo.getUserPenalty(queryAttributes as PenaltyAttributes));
            tasks.push(this.repositories.getRepository().alarmRepo.getUserAlarm(queryAttributes as UserAlarmAttributes));
            tasks.push(this.repositories.getRepository().itemRepo.getMyItemCount(id));
            tasks.push(this.repositories.getRepository().biddingRepo.getMySuccessBidCount(id));
            const [user, penalty, userAlarm, sell, buy] = await Promise.all(tasks);

            log.info('user : ', user);
            log.info('penalty : ', penalty);
            log.info('userAlarm : ', userAlarm);
            log.info('sell : ', sell);
            log.info('buy : ', buy);

            return UserAdapter.buildUser(user as User)
            (penalty as Penalty)
            (userAlarm as UserAlarm)
            (sell as number)
            (buy as number);
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
            if(authResult.authType === 'apple' && authResult.appleAccountSub){
                return await this.repositories.getRepository().userRepo.getUserByAppleSub(authResult.appleAccountSub, authResult.authType);
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
                return await this.repositories.getRepository().userRepo.addUserBySocialAccount(vendor, data! as KakaoUserInfo, transaction);
            }
            if(vendor === 'apple'){
                return await this.repositories.getRepository().userRepo.addUserByAppleAccount(vendor, data! as AppleIdTokenType, transaction);
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
            this.isValidRepositories(['userRepo']);

            const updatedUser = await this.repositories.getRepository().userRepo.updateUser(authInfo.userId, userUpdate);

            return await this.getUser({id:authInfo.userId});
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }

    async updateMembership(authInfo:AuthResult, arg: any, selectionSetList:string[]):Promise<Maybe<User>>{
        try{
            const { status } = arg;

            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }
            if(!status){
                throw ErrorInvalidBodyParameter();
            }
            this.isValidRepositories(['userRepo']);

            const userStatus = status === 'VALID'? 0:1;
            const updatedUser = await this.repositories.getRepository().userRepo.updateMembership(authInfo.userId, userStatus);

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
            this.isValidRepositories(['userRepo']);

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