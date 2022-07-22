import { log, ErrorInvalidToken, AppleIdTokenType } from '../lib'
import { User, Maybe,  Gender, JoinPath, PushToken } from '../types'
import { ModelName, KakaoAccountModel, KakaoUserInfo, KakaoAccount, UserModel, ItemModel, Transaction, UserAttributes, PushTokenAttributes } from './model'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'
import { Model, Op } from 'sequelize'
import { AppleAccountAttributes, AppleAccountModel } from './model/appleAccount'

@Service()
@sealed
class UserRepository extends RepositoryBase{

    async getUser(userId:number, include?:string[]): Promise<User>{
        try{
            const userModel = this.models.getModel(ModelName.user);
            const result:User = await userModel.findOne({
                where: {id: userId},
                include: include || ['kakaoAccount', 'pushToken', 'appleAccount'],
                nest: true, raw: true
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
                    nest: true
                });
            }
            return user;
        }catch(e){
            log.error('exception> getUserBySocialId : ', e);
            throw e;
        }
    }

    async getUserByAppleSub(sub:string, type: string):Promise<Maybe<User>>{
        try{
            const user:User|null = null;
            if(type === 'string'){
                return await this.models.getModel(ModelName.user).findOne({
                    include:[{
                        model:AppleAccountModel,
                        as: 'appleAccount',
                        required: true,
                        where: {
                            sub: sub
                        }
                    }],
                    nest: true
                });
            }
            return user;
        }catch(e){
            log.error('exception> getUserByAppleSub : ', e);
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

    async addAppleUserAccount(vendor:JoinPath, userInfo:AppleIdTokenType, transaction?:Transaction):Promise<Maybe<User>>{
        try{
            const defaultUserInfo:UserAttributes = {
                status: 0,
                joinPath: vendor
            }
            if(!userInfo || !userInfo.sub){
                throw ErrorInvalidToken();
            }

            if(userInfo.email){
                defaultUserInfo.email = userInfo.email;
            }
            const userModel:UserModel = await this.models.getModel(ModelName.user).create(defaultUserInfo,{transaction: transaction});
            let user:User = userModel.get({plain: true});
            log.info('User : ', user);

            const getBoolean = ()=>{

            }
            const appleAccountAttributes:AppleAccountAttributes = {
                userId: user.id,
                status: 0,
                sub: userInfo.sub,
                email: userInfo.email,
                email_verified: (typeof userInfo.email_verified === 'string')? (userInfo.email_verified === 'true'):userInfo.email_verified,
                is_private_email: (typeof userInfo.is_private_email === 'string')? (userInfo.is_private_email === 'true'):userInfo.is_private_email,
            }
            const appleAccountModel:AppleAccountModel = await this.models.getModel(ModelName.appleAccount).create(appleAccountAttributes, {transaction: transaction});
            user.appleAccount = appleAccountModel.get({plain: true});

            log.info('appleAccount : ', user.appleAccount);

            return user;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception> addAppleUserAccount : ', e);
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

    async addUserByAppleAccount(vendor: string, userInfo:AppleIdTokenType, transaction?: Transaction):Promise<Maybe<User>>{
        try{
            if(vendor === 'apple'){
                return await this.addAppleUserAccount(JoinPath.Kakao, userInfo, transaction);
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

    async updateMembership(userId:number, userStatus:number):Promise<Maybe<User>>{
        try{
            const user = await this.models.getModel(ModelName.user).update({status: userStatus}, {where: {id: userId}});
            await this.models.getModel(ModelName.kakaoAccount).update({status: userStatus}, {where: {id: userId}});
            await this.models.getModel(ModelName.appleAccount).update({status: userStatus}, {where: {id: userId}});

            log.info('updateMembership : ', user);
            return user;
        }catch(e){
            log.error('exception> updateMembership : ', e);
            throw e;
        }
    }

    async updatePushToken(userId:number, pushTokenUpdate:PushTokenAttributes):Promise<PushToken>{
        try{
            const pushTokenModel = this.models.getModel(ModelName.pushToken);
            const pushToken = await pushTokenModel.findOne({
                where: {userId: userId},
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
            const pushTokens = await pushTokenModel.findall({
                where: {userId: {[Op.or]: userIds}},
                nest: true
            });

            return pushTokens;
        }catch(e){
            log.error('exception> getPushTokens : ', e);
            throw e;
        }
    }
    async getUsers(userIds:number[], include?:string[]): Promise<User[]>{
        try{
            const userModel = this.models.getModel(ModelName.user);
            const result:User[] = await userModel.findall({
                where: {id: {[Op.or]: userIds}},
                include: include || ['kakaoAccount', 'pushToken'],
                nest: true
            });
            return result;
        }catch(e){
            log.error('exception> UserRepository.getUser : ', e);
            throw e;
        }
    }
}

export { UserRepository }