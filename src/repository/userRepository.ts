import { log, ErrorInvalidToken } from '../lib'
import { User, Maybe,  Gender, JoinPath, PushToken } from '../types'
import { ModelName, KakaoAccountModel, KakaoUserInfo, KakaoAccount, UserModel, ItemModel, Transaction, UserAttributes, PushTokenAttributes } from './model'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'
import { Op } from 'sequelize'

@Service()
@sealed
class UserRepository extends RepositoryBase{

    async getUser(userId:number, include?:string[]): Promise<User>{
        try{
            const userModel = this.models.getModel(ModelName.user);
            const result:User = await userModel.findOne({
                where: {id: userId},
                include: include || ['kakaoAccount', 'pushToken'],
                raw:true,
                nest: true
            });
            return result;
        }catch(e){
            log.error('exception> UserRepository.getUser : ', e);
            throw e;
        }
    }

    async getUserBySocialId(id:number, type: string):Promise<Maybe<User>>{
        try{
            const user:User|null = null;
            if(type === 'kakao'){
                return await this.models.getModel(ModelName.user).findOne({
                    include:[{
                        model:KakaoAccountModel,
                        as: 'kakaoAccount',
                        required: true,
                        where: {
                            id: id
                        }
                    }],
                    raw: true,
                    nest: true
                });
            }
            return user;
        }catch(e){
            log.error('exception> getUserBySocialId : ', e);
            throw e;
        }
    }


    async addKakaoUserAccount(vendor:JoinPath, userInfo:Maybe<KakaoUserInfo>, transaction?:Transaction):Promise<Maybe<User>>{
        try{
            const defaultUserInfo:UserAttributes = {
                status: 0,
                joinPath: vendor
            }
            if(!userInfo && !userInfo!.kakao_account){
                throw ErrorInvalidToken();
            }

            if(userInfo?.kakao_account?.phone_number){
                defaultUserInfo.phone = userInfo.kakao_account.phone_number;
            }
            if(userInfo?.kakao_account?.birthyear && userInfo?.kakao_account?.birthday){
                defaultUserInfo.birth = userInfo.kakao_account.birthyear + userInfo.kakao_account.birthday
            }
            if(userInfo?.kakao_account?.email){
                defaultUserInfo.email = userInfo.kakao_account.email;
            }
            if(userInfo?.kakao_account?.gender){
                defaultUserInfo.gender = userInfo.kakao_account.gender === 'male'? Gender.Male:Gender.Female;
            }
            // const user:User = await this.models.getModel(ModelName.user).create(defaultUserInfo).get({plain:true});
            const userModel:UserModel = await this.models.getModel(ModelName.user).create(defaultUserInfo,{transaction: transaction});
            let user:User = userModel.get({plain: true});
            log.info('User : ', user);

            if(!userInfo?.kakao_account){
                throw ErrorInvalidToken();
            }

            let properties:KakaoAccount = userInfo?.kakao_account;
            properties.id = userInfo.id;
            properties.status = 0;
            properties.userId = user.id;
            const kakaoAccountModel:KakaoAccountModel = await this.models.getModel(ModelName.kakaoAccount).create(properties, {transaction: transaction});
            user.kakaoAccount = kakaoAccountModel.get({plain: true});

            log.info('kakaoAccount : ', user.kakaoAccount);

            return user;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception> addKakaoUserAccount : ', e);
            throw e;
        }
    }

    async addUserBySocialAccount(vendor: string, userInfo:Maybe<KakaoUserInfo>, transaction?: Transaction):Promise<Maybe<User>>{
        try{
            if(vendor === 'kakao'){
                return await this.addKakaoUserAccount(JoinPath.Kakao, userInfo, transaction);
            }
            return null;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception> addUserBySocialAccount : ', e);
            throw e;
        }
    }

    async updateUser(userId:number, userUpdate:UserAttributes):Promise<Maybe<User>>{
        try{
            const user = await this.models.getModel(ModelName.user).update(userUpdate, {where: {id: userId}});
            log.info('updateUser : ', user);
            return user;
        }catch(e){
            log.error('exception> updateUser : ', e);
            throw e;
        }
    }

    async updatePushToken(userId:number, pushTokenUpdate:PushTokenAttributes):Promise<PushToken>{
        try{
            const pushTokenModel = this.models.getModel(ModelName.pushToken);
            const pushToken = await pushTokenModel.findOne({
                where: {userId: userId},
                raw: true,
                nest: true
            });
            if(pushToken){
                log.info('updatePushToken : ', pushToken);
                return await pushTokenModel.update(pushTokenUpdate, {where: {userId: userId}});
            }
            const newPushToken:PushTokenAttributes = {
                status: 0,
                userId: userId,
                token: pushTokenUpdate.token
            }
            log.info('repo > updatePushToken > newPushToken :  ', newPushToken)
            return await pushTokenModel.create(newPushToken);
        }catch(e){
            log.error('exception> updateUser : ', e);
            throw e;
        }
    }

    async getPushTokens(userIds:number[]):Promise<PushToken[]>{
        try{
            const pushTokenModel = this.models.getModel(ModelName.pushToken);
            const pushTokens = await pushTokenModel.findOne({
                where: {userId: {[Op.or]: userIds}},
                raw: true,
                nest: true
            });

            return pushTokens;
        }catch(e){
            log.error('exception> getPushTokens : ', e);
            throw e;
        }
    }
}

export { UserRepository }