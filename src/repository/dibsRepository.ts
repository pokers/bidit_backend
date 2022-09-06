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
    ItemDetailModel,
    DibsModel,
    Models,
    DibsAttributes
} from './model'
import { Op, WhereOptions, Sequelize } from 'sequelize'
import { 
    Bidding,
    BiddingQueryInput,
    BidInput,
    SuccessfulBid,
    Dibs,
    Maybe
} from '../types'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'
import { ErrorCouldNotAdd } from '../lib'

interface includeModel<T> {
    model: T,
    as: string
}

@Service()
@sealed
class DibsRepository extends RepositoryBase{
    // Private Methods
   
    // Public Methods
    async getDibsByUserId(userId:number): Promise<Dibs[]>{
        try{
            const includes = [{
                model: UserModel,
                as: 'user'
            },{
                model: ItemModel,
                as: 'item',
                include:[{
                    model: ItemDescriptionModel,
                    as: 'description',
                },{
                    model: ItemImageModel,
                    as: 'image'
                },{
                    model: CategoryModel,
                    as: 'category'
                },{
                    model: ItemDetailModel,
                    as: 'detail'
                },{
                    model: UserModel,
                    as: 'user'
                }]
            }];

            const model = this.models.getModel(ModelName.dibs);
            const dibs:DibsModel[] = await model.findAll({
                where: {userId: userId, status: 0}, // status 0=valid, 1=invalid
                include: includes
            })
            log.info('dibs : ', dibs);

            const result = dibs.map((item:DibsModel)=>item.get({plain: true}));
            log.info('repo > getDibsByUserId > result : ', result);
            log.info('repo > getDibsByUserId > result : ', JSON.stringify(result));
            return result;
        }catch(e){
            log.error('exception > getDibsByUserId : ', e);
            throw e;
        }
    }

    async getDibsCountByItemId(itemId:number): Promise<number>{
        try{
            const model = this.models.getModel(ModelName.dibs);
            const dibsCount:number = await model.count({
                where: {itemId: itemId, status: 0}, // status 0=valid, 1=invalid
            })
            log.info('dibsCount : ', dibsCount);
            return dibsCount;
        }catch(e){
            log.error('exception > getDibsCountByItemId : ', e);
            throw e;
        }
    }

    async addDibs(userId:number, itemId:number, transaction:Transaction): Promise<Maybe<Dibs>>{
        try{
            const dibsAttributes:DibsAttributes = {
                status: 0,
                userId: userId,
                itemId: itemId,
            }

            const model = this.models.getModel(ModelName.dibs);
            const dibs:DibsModel = await model.create({
                ...dibsAttributes,
            }, {Transaction: transaction});
            // log.info('dibs : ', dibs);
            if(dibs === null){
                throw ErrorCouldNotAdd();
            }
            
            const result = dibs.get({plain: true});
            log.info('repo > addDibs > result : ', JSON.stringify(result));
            return result;
        }catch(e){
            log.error('exception > repo > addDibs : ', e);
            throw e;
        }
    }
}

export { DibsRepository }