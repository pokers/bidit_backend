import { log } from '../../lib/logger'
import { OrmSequlize } from '../../lib/OrmSequlize';

// Models
import { 
    ItemModel,
    ItemDescriptionModel,
    ItemImageModel,
    CategoryModel
} from '.'
import { UserModel } from './User';


enum ModelName {
    item='Item',
    itemDescription='ItemDescription',
    itemImage = 'ItemImage',
    category = 'Category',
    user = 'User',
}

enum CursorName {
    createdAt ='createdAt'
}

enum Order {
    DESC='DESC',
    ASC='ASC'
}

class Models {
    private sequelize:OrmSequlize;
    constructor(){
    }

    initialize(sequelize:OrmSequlize):Models{
        try{
            this.sequelize = sequelize;
            ItemModel.initialize(this.sequelize.getDBInstance());
            ItemDescriptionModel.initialize(this.sequelize.getDBInstance());
            ItemImageModel.initialize(this.sequelize.getDBInstance());
            CategoryModel.initialize(this.sequelize.getDBInstance());
            UserModel.initialize(this.sequelize.getDBInstance());
            return this;
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
    }

    associateHasMany():Models{
        try{
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

            return this;
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
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
            }
            return ItemModel;
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
    }
}


export { Models, ModelName, CursorName, Order }