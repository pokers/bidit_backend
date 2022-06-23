import { log } from '../../lib'
import { SequelizeORM, Transaction, UniqueConstraintError } from '../../lib/SequelizeORM';

// Models
import { 
    ItemModel,
    ItemDescriptionModel,
    ItemImageModel,
    CategoryModel,
    KakaoAccountModel,
    BiddingModel
} from '.'
import { UserModel } from './User';
import { Service } from 'typedi';
import { PushTokenModel } from './pushToken';


enum ModelName {
    item='Item',
    itemDescription='ItemDescription',
    itemImage = 'ItemImage',
    category = 'Category',
    user = 'User',
    kakaoAccount = 'KakaoAccount',
    pushToken = 'pushToken',
    bidding = 'bidding'
}

enum CursorName {
    createdAt ='createdAt'
}

enum Order {
    DESC='DESC',
    ASC='ASC'
}

@Service()
class Models {
    // private sequelize:SequelizeORM;
    private isInitialized:Boolean = false;
    private isAssociated:Boolean = false;
    constructor(private sequelize:SequelizeORM){
    }

    // initialize(sequelize:SequelizeORM):Models{
    initialize():Models{
        try{
            if(!this.isInitialized){
                this.isInitialized = true;
                ItemModel.initialize(this.sequelize.getDBInstance());
                ItemDescriptionModel.initialize(this.sequelize.getDBInstance());
                ItemImageModel.initialize(this.sequelize.getDBInstance());
                CategoryModel.initialize(this.sequelize.getDBInstance());
                UserModel.initialize(this.sequelize.getDBInstance());
                KakaoAccountModel.initialize(this.sequelize.getDBInstance());
                PushTokenModel.initialize(this.sequelize.getDBInstance());
                BiddingModel.initialize(this.sequelize.getDBInstance());
            }
            return this;
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
    }

    associateHasMany():Models{
        try{
            if(!this.isAssociated){
                this.isAssociated = true;
                ItemModel.hasMany(ItemDescriptionModel, { foreignKey: 'itemId', as: 'description', sourceKey: 'id'});
                ItemDescriptionModel.belongsTo(ItemModel, { foreignKey: 'itemId', targetKey: 'id'});
                
                ItemModel.hasMany(ItemImageModel, { foreignKey: 'itemId', as: 'image', sourceKey: 'id'});
                ItemImageModel.belongsTo(ItemModel, { foreignKey: 'itemId', targetKey: 'id'});

                ItemModel.hasOne(CategoryModel, {foreignKey: 'id', sourceKey: 'categoryId', as: 'category'});
                // CategoryModel.hasOne(ItemModel, {foreignKey: 'categoryId', as: 'item', sourceKey: 'id'});

                CategoryModel.belongsTo(CategoryModel, {foreignKey: 'parentId', targetKey: 'id', as: 'parent'});
                // CategoryModel.hasOne(CategoryModel, {foreignKey: 'parentId', sourceKey: 'id'});

                UserModel.hasMany(ItemModel, {foreignKey: 'userId', as: 'items', sourceKey: 'id'});
                ItemModel.belongsTo(UserModel, {foreignKey: 'userId', targetKey: 'id'});

                UserModel.hasOne(KakaoAccountModel, {foreignKey: 'userId', as:'kakaoAccount', sourceKey: 'id'});
                KakaoAccountModel.belongsTo(UserModel, {foreignKey: 'userId' ,targetKey: 'id'});

                UserModel.hasOne(PushTokenModel, {foreignKey: 'userId', as:'pushToken', sourceKey: 'id'});
                PushTokenModel.belongsTo(UserModel, {foreignKey: 'userId' ,targetKey: 'id'});

                UserModel.hasMany(BiddingModel, {foreignKey: 'userId', sourceKey: 'id'});
                ItemModel.hasMany(BiddingModel, {foreignKey: 'itemId', sourceKey: 'id'});
                BiddingModel.belongsTo(UserModel, {foreignKey: 'userId', as: 'user', targetKey: 'id'});
                BiddingModel.belongsTo(ItemModel, {foreignKey: 'itemId', as: 'item', targetKey: 'id'});
            }
            return this;
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
    }

    async startTransaction():Promise<Transaction>{
        return await this.sequelize.startTransaction();
    }
    async commit(transaction:Transaction){
        await this.sequelize.commit(transaction);
    }
    async rollback(transaction:Transaction){
        await this.sequelize.rollback(transaction);
    }

    getModel(name:ModelName):any{
        try{
            // TODO : it shoud be updated, because structure or class name is Item which means that it starts Upper case but the table name is not.
            switch(name){
                case ModelName.item: return ItemModel;
                case ModelName.itemDescription: return ItemDescriptionModel;
                case ModelName.itemImage: return ItemImageModel;
                case ModelName.category: return CategoryModel;
                case ModelName.user: return UserModel;
                case ModelName.kakaoAccount: return KakaoAccountModel;
                case ModelName.pushToken: return PushTokenModel;
                case ModelName.bidding: return BiddingModel;
            }
            return ItemModel;
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
    }
}


export { Models, ModelName, CursorName, Order, Transaction, UniqueConstraintError }