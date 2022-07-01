import { 
    Item, 
    User,
    Bidding
} from '../types';
import { ItemRepository, UserRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorUserNotFound, ErrorInvalidPushToken, ErrorInvalidBodyParameter } from '../lib';
import { ModelName, CursorName, Order, Transaction, ItemAttributes, SuccessfulBidModel, SuccessfulBidAttributes } from '../repository/model';
import { Service, Container } from 'typedi'
import { ServiceBase } from './serviceBase'
import { FcmMessage, Fcm } from '../lib'


type PushData = {
    userId:number,
    typeId:number,
    itemId:number,
    message?:string
}

@Service()
class PushService extends ServiceBase{
    
    // Private Methods
    private logInfo(...arg:any){
        log.info('PushService > ', ...arg);
    }
    private async sendPushMessage(message:FcmMessage){
        try{
            // send push message
            await Container.get(Fcm).sendPushMessage(message);
        }catch(e){
            log.error('exception > svc > sendPushMessage:  ', e);
            throw e;
        }
    }


    // Public Methods
    async notifyHighBidder(arg:any){
        try{
            if(!arg.item){
                throw ErrorInvalidBodyParameter();
            }
            const bidding:Bidding = arg.item;
            const message:FcmMessage = {
                title: '상위 입찰자가 있습니다!!',
                body: '😲 UH-OH!! 누군가 더 높은 가격을 BID했습니다! 다시 BID하여 제품을 지키세요!',
                token: ''
            }
            if(!this.repositories.getRepository().biddingRepo){
                throw ErrorModuleNotFound();
            }
            const userRepo:UserRepository = this.repositories.getRepository().userRepo;
            const user:User = await userRepo.getUser(bidding.userId);
            log.info('notifyHighBidder> user : ', user);
            if(!user){
                throw ErrorUserNotFound();
            }

            if(!user.pushToken){
                throw ErrorInvalidPushToken();
            }
            message.token = user.pushToken.token!

            if(bidding.itemId){
                const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
                const item:Item = await itemRepo.getItem(bidding.itemId);
                log.info('notifyHighBidder> item : ', item);
                message.body = `😲 UH-OH!! 누군가 ${item.name}에 더 높은 가격을 BID했습니다! 다시 BID하여 제품을 지키세요!.`
            }

            // send push message
            await this.sendPushMessage(message);
        }catch(e){
            log.error('exception > svc > notifyHighBidder:  ', e);
            throw e;
        }
    }
}

export { PushService }
