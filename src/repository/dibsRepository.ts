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
    Models
} from './model'
import { Op, WhereOptions, Sequelize } from 'sequelize'
import { 
    Bidding,
    BiddingQueryInput,
    BidInput,
    SuccessfulBid,
    Dibs
} from '../types'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'

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
                where: {userId: userId},
                include: includes
            })

            const result = dibs.map((item:DibsModel)=>item.get({plain: true}));
            log.info('repo > getDibsByUserId > result : ', result);
            log.info('repo > getDibsByUserId > result : ', JSON.stringify(result));
            return result;
        }catch(e){
            log.error('exception > getDibsByUserId : ', e);
            throw e;
        }
    }
}

export { DibsRepository }