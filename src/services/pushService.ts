import { 
    Item, 
    User,
    Bidding,
    PushToken
} from '../types';
import { ItemRepository, UserRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorUserNotFound, ErrorInvalidPushToken, ErrorInvalidBodyParameter } from '../lib';
import { ModelName, CursorName, Order, Transaction, ItemAttributes, SuccessfulBidModel, SuccessfulBidAttributes } from '../repository/model';
import { Service, Container } from 'typedi'
import { ServiceBase } from './serviceBase'
import { FcmMessage, Fcm } from '../lib'
import { BiddingRepository } from '../repository/biddingRespository';


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

    async notifyEndingSoon(arg:any){
        try{
            if(!arg.item){
                throw ErrorInvalidBodyParameter();
            }
            const item:Item = arg.item;

            if(!this.repositories.getRepository().biddingRepo){
                throw ErrorModuleNotFound();
            }
            const userRepo:UserRepository = this.repositories.getRepository().userRepo;
            const biddingRepo:BiddingRepository = this.repositories.getRepository().biddingRepo;

            const seller:User = await userRepo.getUser(item.userId);
            log.info('notifyEndingSoon> seller : ', seller);
            if(!seller){
                throw ErrorUserNotFound();
            }
            if(!seller.pushToken){
                throw ErrorInvalidPushToken();
            }

            const buyers = await biddingRepo.getHighPriceBid(item.id, item.dueDate);
            log.info('notifyEndingSoon > buyers : ', buyers);

            const userIds = [...buyers.map(item=>item.userId)];
            log.info('notifyEndingSoon > userIds : ', userIds);
            const pushTokens:PushToken[] = await userRepo.getPushTokens(userIds);
            log.info('notifyEndingSoon > tokens : ', pushTokens);

            const sellerMessage:FcmMessage = {
                title: '경매 종료 알림!',
                body: `⏰ HURRY!! ${item.name}의 판매가 30분 뒤 마감됩니다. BID 현황을 확인해 보세요!`,
                token: seller.pushToken.token!
            }
            // send push message
            await this.sendPushMessage(sellerMessage);
            await Promise.all(pushTokens.map(pushToken=>{
                const buyerMessage:FcmMessage = {
                    title: '경매 종료 알림!',
                    body: `⏰ HURRY!! BID하신 ${item.name}의 판매가 30분 뒤 마감됩니다! BID 현황을 확인해 보세요!`,
                    token: pushToken.token!
                }
                // send push message
                return this.sendPushMessage(buyerMessage);
            }));

        }catch(e){
            log.error('exception > svc > notifyEndingSoon:  ', e);
            throw e;
        }
    }


    async notifySuccessfulBid(arg:any){
        try{
            if(!arg.item){
                throw ErrorInvalidBodyParameter();
            }
            const bidding:Bidding = arg.item;
            if(!this.repositories.getRepository().biddingRepo){
                throw ErrorModuleNotFound();
            }
            const userRepo:UserRepository = this.repositories.getRepository().userRepo;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            
            const buyer:User = await userRepo.getUser(bidding.userId);
            log.info('notifySuccessfulBid> buyer : ', buyer);
            if(!buyer){
                throw ErrorUserNotFound();
            }
            if(!buyer.pushToken){
                throw ErrorInvalidPushToken();
            }

            const item:Item = await itemRepo.getItem(bidding.itemId);
            const seller:User = await userRepo.getUser(item.userId);
            log.info('notifySuccessfulBid> buyer : ', seller);
            if(!seller){
                throw ErrorUserNotFound();
            }

            if(!seller.pushToken){
                throw ErrorInvalidPushToken();
            }
            const buyerMessage:FcmMessage = {
                title: '경매 종료 알림',
                body: `🥳 HOORAY! ${item.name}를 ${bidding.price}원에 낙찰받았습니다! 채팅을 통해 구매를 완료해 주세요!`,
                token: buyer.pushToken.token!
            }
            const sellerMessage:FcmMessage = {
                title: '경매 종료 알림',
                body: `🥳 HOORAY! ${item.name}가 최고입찰가 ${bidding.price}원에 낙찰되었습니다! 채팅을 통해 판매를 완료해주세요!`,
                token: seller.pushToken.token!
            }

            // send push message
            await Promise.all([this.sendPushMessage(buyerMessage), this.sendPushMessage(sellerMessage)]);
        }catch(e){
            log.error('exception > svc > notifySuccessfulBid:  ', e);
            throw e;
        }
    }

    async notifyFailureItem(arg:any){
        try{
            if(!arg.item){
                throw ErrorInvalidBodyParameter();
            }
            const item:Item = arg.item;
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const userRepo:UserRepository = this.repositories.getRepository().userRepo;
            const seller:User = await userRepo.getUser(item.userId);
            log.info('notifyFailureItem> buyer : ', seller);
            if(!seller){
                throw ErrorUserNotFound();
            }

            if(!seller.pushToken){
                throw ErrorInvalidPushToken();
            }
            const sellerMessage:FcmMessage = {
                title: '경매 종료 알림',
                body: `💔 UNLUCKY 아쉽게도 ${item.name}가 유찰되었습니다. 제품을 재등록해 보세요!`,
                token: seller.pushToken.token!
            }

            // send push message
            await this.sendPushMessage(sellerMessage);
        }catch(e){
            log.error('exception > svc > notifyFailureItem:  ', e);
            throw e;
        }
    }

    async notifyFailedBid(arg:any){
        try{
            if(!arg.item){
                throw ErrorInvalidBodyParameter();
            }
            const bidding:Bidding = arg.item;
            if(!this.repositories.getRepository().biddingRepo){
                throw ErrorModuleNotFound();
            }
            const userRepo:UserRepository = this.repositories.getRepository().userRepo;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            
            const buyer:User = await userRepo.getUser(bidding.userId);
            log.info('notifyFailedBid> buyer : ', buyer);
            if(!buyer){
                throw ErrorUserNotFound();
            }
            if(!buyer.pushToken){
                throw ErrorInvalidPushToken();
            }

            const item:Item = await itemRepo.getItem(bidding.itemId);
            const buyerMessage:FcmMessage = {
                title: '경매 종료 알림',
                body: `💔 UNLUCKY 아쉽게도 BID하셨던 ${item.name}낙찰에 실패했습니다. 더 좋은 기회가 있을거에요!`,
                token: buyer.pushToken.token!
            }

            // send push message
            await Promise.all([this.sendPushMessage(buyerMessage)]);
        }catch(e){
            log.error('exception > svc > notifyFailedBid:  ', e);
            throw e;
        }
    }
}

export { PushService }
