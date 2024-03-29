import { log } from '../lib/logger'
import { ItemModel, 
    CategoryModel, 
    ModelName, 
    CursorName, 
    Transaction, 
    ItemAttributes, 
    ItemDescriptionAttributes, 
    ItemImageAttributes, 
    BiddingAttributes, 
    UserModel, 
    SuccessfulBidAttributes, 
    KakaoAccountModel, 
    ItemDescriptionModel, 
    ItemImageModel, 
    BiddingModel,
    ItemDetailModel 
} from './model'
import { Op, WhereOptions, Sequelize } from 'sequelize'
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
            const itemInclude = [{
                model: ItemDescriptionModel,
                as: 'description',
            },{
                model: ItemImageModel,
                as: 'image',
            },{
                model: CategoryModel,
                as: 'category',
            },{
                model: ItemDetailModel,
                as: 'detail',
            },{
                model: UserModel,
                as: 'user'
            }];
            const biddingInclude = [{
                model: ItemModel,
                as: 'item',
                order: [['createdAt', 'DESC']],
                required: true,
                include: itemInclude
            },
            {
                model: UserModel,
                as: 'user',
                required: true,
            }]

            const bidding:BiddingModel[] = await model.findAll({
                where: {userId: userId, ...biddingQuery},
                include: biddingInclude,
                nest: true
            });

            const result = bidding.map((item:BiddingModel)=>item.get({plain: true}));
            log.info('repo > getMyBidding > result : ', result);
            log.info('repo > getMyBidding > result : ', JSON.stringify(result));
            return result;
        }catch(e){
            log.error('exception > getMyBidding : ', e);
            throw e;
        }
    }

    async getBidding(biddingQuery:BiddingQueryInput): Promise<Bidding[]>{
        try{
            const model = this.models.getModel(ModelName.bidding);
            const bidding:BiddingModel[] = await model.findAll({
                where: {...biddingQuery},
                include: [{
                    model: ItemModel,
                    as: 'item',
                    include: [{
                        model: ItemDescriptionModel, 
                        as: 'description', 
                    },{
                        model: ItemImageModel,
                        as: 'image',
                    }],
                    // required: true,
                },{
                    model: UserModel,
                    as: 'user',
                    include: [{
                        model: KakaoAccountModel, as: 'kakaoAccount', 
                    }],
                    // required: true
                }],
                order: [['createdAt', 'DESC']],
                nest: true
            });
            const result = bidding.map((item:BiddingModel)=>item.get({plain: true}));
            log.info('repo > getBidding > result : ', JSON.stringify(result));
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

    async getHighPriceBid(itemId:number, dueDate?:string|null, limit?:number): Promise<Bidding[]>{
        try{
            const query = `SELECT * FROM bidding as t1, (SELECT max(price) as price FROM bidding WHERE status=0 AND itemId=${itemId} ${dueDate? 'AND createdAt <= "'+dueDate+'"':''} GROUP BY userId) as t2 WHERE t1.status=0 AND t1.itemId=${itemId} ${dueDate? 'AND t1.createdAt <= "'+dueDate+'"':''} AND t1.price=t2.price ORDER BY t1.price DESC LIMIT ${limit||5}`;
            const result = await this.models.query(query);
            return result[0] || [];
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

    async getMySuccessBidCount(userId:number): Promise<number>{
        try{
            const model = this.models.getModel(ModelName.successfulBid);
            return await model.count({where:{userId:userId}});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > getMySuccessBidCount : ', e);
            throw e;
        }
    }
}

export { BiddingRepository }