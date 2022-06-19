import 'reflect-metadata';
import { log, ErrorInvalidToken, ErrorCouldNotAdd, ErrorNotFoundSocialUserInfo, ErrorUserNotFound, Crypto } from '../lib'
import { AppSyncResolverEvent, Context, AppSyncIdentityLambda } from 'aws-lambda'
import { User, ItemQueryInput, ItemConnection, Maybe, UserInfoResult } from '../types'
import { Provider } from './provider'
import { UserService, ItemService, AuthService } from '../services'
import { Container } from 'typedi'
import { Transaction } from 'sequelize/types';
import { SQS } from 'aws-sdk';

const getUser = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        const getUser = async ():Promise<User>=>{
            return await Container.get(UserService).getUser(event.arguments, event.info.selectionSetList);
        }
        const getItem = async ():Promise<ItemConnection>=>{
            if(event.info.selectionSetList?.indexOf('items') >= 0){
                const itemQuery:ItemQueryInput = {userId: event.arguments.id};
                return Container.get(ItemService).getItemList({itemQuery}, event.info.selectionSetList);
            }
            return {};
        }
        const [user, items]= await Promise.all([getUser(), getItem()]);
        log.info('result user: ', user);
        log.info('result items : ', items);
        if(user){
            user.items = items;
        }
        log.info('result : ', user);
        return user;
    }catch(e){
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const addUser = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    let transaction:Transaction|null = null;
    let userService:UserService|null = null;
    try{
        const getSocialUserInfo = async ():Promise<UserInfoResult>=>{
            if(event.request.headers.authorization){
                return await Container.get(AuthService).getSocialUserInfo(event.request.headers.authorization);
            }
            throw ErrorInvalidToken();
        }
        
        const [socialUserInfo]= await Promise.all([getSocialUserInfo()]);
        log.info('socialUserInfo : ', socialUserInfo);

        userService = Container.get(UserService);
        transaction = await userService.startTransaction();
        const user = await userService.addUser(socialUserInfo, transaction);
        log.info('addUser result : ', user);

        if(!user){
            throw ErrorCouldNotAdd();
        }
        await userService.commit(transaction);
        return user;
    }catch(e){
        if(transaction && userService){
            log.error('exception > addUser : rollback!!!');
            await userService.rollback(transaction);
        }
        log.error('exception > addUser : ', e);
        throw e;
    }
}

// For Testing of SQS/Lambda
const produceAddUserEvent = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        const identity:AppSyncIdentityLambda = event.identity as AppSyncIdentityLambda;
        if(!identity || !identity.resolverContext){
            throw ErrorNotFoundSocialUserInfo();
        }
        let plainText:string = 'addUser';
        if(identity.resolverContext.kakaoAccountId){
            plainText += identity.resolverContext.kakaoAccountId;
            const hash  = Container.get(Crypto).getHash(plainText);
            const sqsInst = new SQS({apiVersion: '2012-11-05'});
            const sendParams:SQS.Types.SendMessageRequest = {
                QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/164739657386/testQueue.fifo',
                MessageBody: JSON.stringify(event),
                DelaySeconds: 0,
                MessageDeduplicationId: hash,
                MessageGroupId: hash
            }

            const sendResult = await sqsInst.sendMessage(sendParams).promise();
            log.info('hash : ', hash);
            log.info('sendMesage : ', sendResult);

            const recvParams:SQS.Types.ReceiveMessageRequest = {
                QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/164739657386/addUserQueue.fifo',
                MaxNumberOfMessages: 10,
                VisibilityTimeout: 5,
                WaitTimeSeconds: 20
            }
            // const recvResult:SQS.Types.ReceiveMessageResult = await sqsInst.receiveMessage(recvParams).promise();
            const recvResult:SQS.Types.ReceiveMessageResult = await sqsInst.receiveMessage(recvParams).promise();
            console.log('recvResult : ', recvResult);
            if(recvResult.Messages && recvResult.Messages.length){
                const recvMessage = recvResult.Messages.find(message=>{
                    if(message.Body){
                        const body = JSON.parse(message.Body);
                        console.log('message body : ', body);
                        if(body.MessageGroupId){
                            return body.MessageGroupId === hash;
                        }
                    }
                    return false;
                });

                if(recvMessage && recvMessage.ReceiptHandle){
                    if(recvResult.Messages && recvResult.Messages.length > 0 && recvResult.Messages[0].ReceiptHandle){
                        const delParams:SQS.Types.DeleteMessageRequest = {
                            QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/164739657386/addUserQueue.fifo',
                            ReceiptHandle: recvMessage.ReceiptHandle
                        }
                        log.info('delete message : ', delParams);
                        sqsInst.deleteMessage(delParams).promise();
                    }
                }
            }
        }
        return {} as User;
    }catch(e){
        log.error('exception > addUser : ', e);
        throw e;
    }
}



const me = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        
        const identity:AppSyncIdentityLambda = event.identity as AppSyncIdentityLambda;
        if(!identity || !identity.resolverContext || !identity.resolverContext.userId){
            throw ErrorNotFoundSocialUserInfo();
        }
        const userId:number = identity.resolverContext.userId;

        const me = async (userId:number):Promise<User>=>{
            return await Container.get(UserService).getUser({id:userId});
        }

        const getItem = async (userId:number):Promise<ItemConnection>=>{
            if(event.info.selectionSetList?.indexOf('items') >= 0){
                const itemQuery:ItemQueryInput = {userId: userId};
                return Container.get(ItemService).getItemList({itemQuery}, event.info.selectionSetList);
            }
            return {};
        }

        const [user, items]= await Promise.all([me(userId), getItem(userId)]);
        log.info('me result : ', user);        
        if(!user){
            throw ErrorUserNotFound();
        }
        user.items = items;
        return user;
    }catch(e){
        log.error('exception > me : ', e);
        throw e;
    }
}


const initialize = async()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.initialize();
    }catch(e){
        log.error('exception > initialize : ', e);
        throw e;
    }
}

const destroy = async ()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.destroy();
    }catch(e){
        log.error('exception > destroy : ', e);
        throw e;
    }
}

const userResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked userResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        await initialize();
        switch(event.info.fieldName){
            case 'getUser':
                payload = await getUser(event);
                break;
            case 'addUser':
                payload = await addUser(event);
                // payload = await produceAddUserEvent(event);
                break;
            case 'me':
                payload = await me(event);
                break;
            default:
                break;
        }
        log.info('payload : ', payload);
        await destroy();
        return payload;
    }catch(e){
        await destroy();
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { userResolver }