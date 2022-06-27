import { log } from '../lib/logger'
import { ItemModel, CategoryModel, ModelName, CursorName, Transaction, ItemAttributes, ItemDescriptionAttributes, ItemImageAttributes, BiddingAttributes, UserModel, SuccessfulBidAttributes } from './model'
import { Op, WhereOptions } from 'sequelize'
import { 
    Bidding,
    BiddingQueryInput,
    BidInput,
    SuccessfulBid
} from '../types'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'

@Service()
@sealed
class BiddingRepository extends RepositoryBase{
    // Private Methods

    // Public Methods
    async getMyBidding(userId:number, biddingQuery:BiddingQueryInput): Promise<Bidding[]>{
        try{
            const model = this.models.getModel(ModelName.bidding);
            const result:Bidding[] = await model.findAll({
                where: {userId: userId, ...biddingQuery},
                include: [{
                    model: ItemModel,
                    as: 'item',
                    order: [['createdAt', 'DESC']],
                    required: true,
                }],
                raw:true, nest: true
            });
            log.info('repo > getMyBidding > result : ', result);
            return result;
        }catch(e){
            log.error('exception > getMyBidding : ', e);
            throw e;
        }
    }

    async getBidding(biddingQuery:BiddingQueryInput): Promise<Bidding[]>{
        try{
            const model = this.models.getModel(ModelName.bidding);
            const result:Bidding[] = await model.findAll({
                where: {...biddingQuery},
                include: [{
                    model: ItemModel,
                    as: 'item',
                    required: true,
                },{
                    model: UserModel,
                    as: 'user',
                    required: true
                }],
                order: [['createdAt', 'DESC']],
                raw:true, nest: true
            });
            log.info('repo > getBidding > result : ', result);
            return result;
        }catch(e){
            log.error('exception > getBidding : ', e);
            throw e;
        }
    }

    async getMaxPriceBid(itemId:number, dueDate?:string|null): Promise<Bidding>{
        try{
            const model = this.models.getModel(ModelName.bidding);
            let where:WhereOptions = {itemId: itemId};
            if(dueDate){
                where = {...where, createdAt: {[Op.lte]: dueDate}}
            }
            const result = await model.findOne({
                where: where,
                limit: 1,
                order: [['price', 'DESC']],
                raw:true, nest: true
            });
            return result;
        }catch(e){
            log.error('exception > addBid : ', e);
            throw e;
        }
    }

    async addBid(userId:number, bid:BidInput, transaction:Transaction): Promise<Bidding>{
        try{
            const model = this.models.getModel(ModelName.bidding);
            
            const bidding = await model.create({userId: userId, ...bid},{transaction: transaction});
            log.info('repo > addBid > result : ', bidding);
            return bidding.get({plain: true});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > addBid : ', e);
            throw e;
        }
    }

    async addSuccessfulBid(successBidItem:SuccessfulBidAttributes, transaction:Transaction): Promise<SuccessfulBid>{
        try{
            const model = this.models.getModel(ModelName.successfulBid);
            const bidding = await model.create(successBidItem,{transaction: transaction});
            log.info('repo > addSuccessfulBid > result : ', bidding);
            return bidding.get({plain: true});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > addSuccessfulBid : ', e);
            throw e;
        }
    }
}

export { BiddingRepository }