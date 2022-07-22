import { log } from '../lib/logger'
import { ItemModel, CategoryModel, ModelName, CursorName, Transaction, ItemAttributes, ItemDescriptionAttributes, ItemImageAttributes, Order, ItemDescriptionModel, ItemImageModel, ItemDetailModel, ItemDetailAttributes, UserAlarmModel, UserModel } from './model'
import { Op, WhereOptions } from 'sequelize'
import { Item, 
    ItemQueryInput, 
    ItemDescription, 
    ItemImage, 
    CategoryQueryInput, 
    FirstLastItem, 
    Category,
    ItemImageUpdateInput,
    ItemAddInput,
    User,
    ItemDetail,
} from '../types'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'

type QueryOptions = {
    keyword?: string,
    start?: string,
    end?: string,
    order?: Order
    limit?: number
}

@Service()
@sealed
class ItemRepository extends RepositoryBase{
    // Private Methods

    // Public Methods
    async getItem(itemId:number, include?:string[]): Promise<Item>{
        try{
            const defaultInclude = [{
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
                as: 'user',
                include: ['kakaoAccount', 'pushToken', 'appleAccount'],
            }];
            const model = this.models.getModel(ModelName.item);
            const result:Item = await model.findOne({
                where: {id: itemId},
                include: include || defaultInclude,
                nest: true
            });
            return result;
        }catch(e){
            log.error('exception > getItem : ', e);
            throw e;
        }
    }
    
    async getItemDescription(itemId:number): Promise<ItemDescription>{
        try{
            const model = this.models.getModel(ModelName.itemDescription);
            const result:ItemDescription = await model.findOne({
                where: {id: itemId},
                nest: true
            });
            return result;
        }catch(e){
            log.error('exception > getItemDescription : ', e);
            throw e;
        }
    }

    async getItemImage(itemId:number): Promise<ItemImage>{
        try{
            const model = this.models.getModel(ModelName.itemImage);
            const result:ItemImage = await model.findOne({
                where: {id: itemId}
            });
            return result;
        }catch(e){
            log.error('exception > getItemImage : ', e);
            throw e;
        }
    }

    async getFirstLastItem<T>(cursor: CursorName, modelName:ModelName, itemQuery?: ItemQueryInput, keyword?: String): Promise<FirstLastItem<T>>{
        try{
            let result: FirstLastItem<T> = {} as FirstLastItem<T>;
            let where: WhereOptions = {};
            if(itemQuery){
                if(itemQuery.dueDate){
                    where = {...where, dueDate: {[Op.lte]: itemQuery.dueDate}};
                    delete itemQuery.dueDate;
                }
                where = { ...where, ...itemQuery};
            }
            if(keyword){
                const substr = {
                    name: {[Op.substring]: keyword},
                    title: {[Op.substring]: keyword}
                }
                where = { ...where, ...substr};
            }
            const model = this.models.getModel(modelName);
            const first = await model.findOne({
                // attributes: [cursor],
                where,
                limit: 1,
                order: [[cursor, 'ASC']],
                nest: true
            });
            log.info('First : ', first);

            const last = await model.findOne({
                // attributes: [cursor],
                where,
                limit: 1,
                order: [[cursor, 'DESC']],
                nest: true
            });
            log.info('last : ', last);

            result.first = first;
            result.last = last;

            return result;
        }catch(e){
            log.error('exception > getFirstLastItem : ', e);
            throw e;
        }
    }

    async getItemList(itemQuery?: ItemQueryInput, keyword?:String, first?:number, last?:number, after?:string, before?:string, cursorType?:CursorName): Promise<Item[]>{
        try{
            const cursor: CursorName = cursorType || CursorName.createdAt;
            let where: WhereOptions = {};
            let limit: number = 50;
            let order:string = 'DESC';

            if(itemQuery){
                if(itemQuery.dueDate){
                    where = {...where, dueDate: {[Op.lte]: itemQuery.dueDate}};
                    delete itemQuery.dueDate;
                }
                where = { ...where, ...itemQuery};
            }
            if(keyword){
                const substr = {
                    name: {[Op.substring]: keyword},
                    title: {[Op.substring]: keyword}
                }
                where = { ...where, ...substr};
            }
            if(after){
                where = { ...where, createdAt: {[Op.gt]: after}};
            }
            if(before){
                where = { ...where, createdAt: {[Op.lt]: before}};
            }
            if(first){
                limit = first;
                order = 'ASC';
            }
            if(last){
                limit = last;
                order = 'DESC'
            }
            const itemModel = this.models.getModel(ModelName.item);
            const items = await itemModel.findAll({
                where, 
                limit, 
                order:[[cursor, order]], 
                include: ['description', 'image', 'category', 'detail', 'user'],
                nest: true
            });
            if(last){
                items.sort((a:Item,b:Item)=>{
                    const aDate = new Date(a.createdAt).getTime();
                    const bDate = new Date(b.createdAt).getTime();
                    return bDate - aDate;
                });
            }
            return items;
        }catch(e){
            log.error('exception > getItemList : ', e);
            throw e;
        }
    }
    

    async getItemsByDueDate(itemQuery?: ItemQueryInput, options?:QueryOptions, include?:string[]): Promise<Item[]>{
        try{
            const queryOptions = options || {};
            let where: WhereOptions = {};
            let limit: number = queryOptions.limit || 50;

            if(itemQuery){
                where = { ...where, ...itemQuery};
            }
            if(queryOptions.keyword){
                const substr = {
                    name: {[Op.substring]: queryOptions.keyword},
                    title: {[Op.substring]: queryOptions.keyword}
                }
                where = { ...where, ...substr};
            }
            if(queryOptions.start && queryOptions.end){
                where = { ...where, dueDate: {[Op.gte]: queryOptions.start, [Op.lte]: queryOptions.end}};
            }
            else if(queryOptions.start){
                where = { ...where, dueDate: {[Op.gte]: queryOptions.start}};
            }
            else if(queryOptions.end){
                where = { ...where, dueDate: {[Op.lte]: queryOptions.end}};
            }

            const itemModel = this.models.getModel(ModelName.item);
            const items = await itemModel.findAll({
                where, 
                limit, 
                order: queryOptions.order? [['dueDate', queryOptions.order]]:null,
                include: include,//['description', 'image', 'category'],
                nest: true
            });

            log.info('repo> getItemsByDueDate > result : ', items);
            return items;
        }catch(e){
            log.error('exception > getItemsByDueDate : ', e);
            throw e;
        }
    }
    
    async addItemImages(itemId:number, imageUrls: string[], transaction:Transaction): Promise<ItemImage[]>{
        try{
            const itemImageModel = this.models.getModel(ModelName.itemImage);
            const itemImages = await Promise.all(imageUrls.map(async url=>{
                const result = await itemImageModel.create({
                    status: 0,
                    itemId: itemId,
                    type: 0,
                    url: url
                },{transaction: transaction});
                return result.get({plain: true});
            }));
            log.info('addItemImages result : ', itemImages);
            return itemImages;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > addItemImages : ', e);
            throw e;
        }
    }

    async updateItemImage(itemId:number, itemImageUpdate:ItemImageUpdateInput): Promise<ItemImage>{
        try{
            const itemImageModel = this.models.getModel(ModelName.itemImage);
            
            const itemImage = itemImageModel.update({
                url: itemImageUpdate.image
            }, {where: {id:itemImageUpdate.itemImageId}});
            log.info('updateItemImage : ', itemImage);
            return itemImage;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > updateItem : ', e);
            throw e;
        }
    }


    async addItemDescription(itemId:number, description: string, transaction:Transaction): Promise<ItemDescription>{
        try{
            const newItem:ItemDescriptionAttributes = {
                status: 0,
                itemId: itemId,
                type: 0,
                description:description
            }
            
            const itemDescriptionModel = this.models.getModel(ModelName.itemDescription);
            const result = await itemDescriptionModel.create(
                newItem,
                {transaction: transaction}
            );

            return result.get({plain: true});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > addItemDescription : ', e);
            throw e;
        }
    }


    async updateItemDescription(itemId:number, description: string): Promise<ItemDescription>{
        try{
            const updateItem:ItemDescriptionAttributes = {
                status: 0,
                itemId: itemId,
                type: 0,
                description:description
            }
            
            const itemDescriptionModel = this.models.getModel(ModelName.itemDescription);
            const itemDescription = await itemDescriptionModel.update(
                updateItem, {where: {itemId:itemId}}
            )
            log.info('updateItemDescription : ', itemDescription);
            return itemDescription;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > updateItemDescription : ', e);
            throw e;
        }
    }

    async addItemDetail(itemId:number, itemDetail: ItemDetailAttributes, transaction:Transaction): Promise<ItemDetail>{
        try{
            itemDetail.itemId = itemId;
            const itemDetailModel = this.models.getModel(ModelName.itemDetail);
            const result = await itemDetailModel.create(
                itemDetail,
                {transaction: transaction}
            );

            return result.get({plain: true});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > addItemDetail : ', e);
            throw e;
        }
    }

    async updateItemDetail(itemId:number, detail: ItemDetailAttributes): Promise<ItemDetail>{
        try{
            const itemDetailModel = this.models.getModel(ModelName.itemDetail);
            const itemDetail = await itemDetailModel.update(
                detail, {where: {itemId:itemId}}
            )
            log.info('updateItemDetail : ', itemDetail);
            return itemDetail;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > updateItemDescription : ', e);
            throw e;
        }
    }

    async addItem(userId:number, itemAdd: ItemAttributes, transaction:Transaction, description: string,  images?:string[], detail?:ItemDetailAttributes): Promise<Item>{
        try{
            const newItem:ItemAttributes = {
                status: 0, // 0=registered
                userId: userId,
                categoryId: itemAdd.categoryId,
                sPrice: itemAdd.sPrice,
                cPrice: itemAdd.cPrice,
                buyNow: itemAdd.buyNow,
                viewCount: 0,
                name: itemAdd.name,
                title: itemAdd.title,
                dueDate: itemAdd.dueDate,
                deliveryType: itemAdd.deliveryType,
                sCondition: itemAdd.sCondition,
                aCondition: itemAdd.aCondition,
            }
            
            const itemModel = this.models.getModel(ModelName.item);
            const item:ItemModel = await itemModel.create(
                newItem,
                {transaction: transaction}
            );
            log.info('item : ', item);

            const tasks = [];
            
            tasks.push(this.addItemDescription(item.id, description, transaction));
            tasks.push(this.getCategory(itemAdd.categoryId!));
            if(images){
                tasks.push(this.addItemImages(item.id, images, transaction));
            }
            if(detail){
                tasks.push(this.addItemDetail(item.id, detail, transaction));
            }
            const [itemDescription, itemCategory, itemImages] = await Promise.all(tasks);

            log.info('addItem item : ', item);
            log.info('addItem description : ', itemDescription);
            log.info('addItem itemCategory : ', itemCategory);
            log.info('addItem images : ', itemImages);


            return item;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > getItemList : ', e);
            throw e;
        }
    }



    async updateItem(itemId:number, itemUpdate: ItemAttributes, description?: string, detail?:ItemDetailAttributes, transaction?:Transaction): Promise<Item>{
        try{
            const itemModel = this.models.getModel(ModelName.item);
            const tasks = [];
            
            tasks.push(itemModel.update(itemUpdate, {where: {id:itemId}, transaction: transaction}));
            if(description){
                tasks.push(this.updateItemDescription(itemId, description));
            }
            if(detail){
                tasks.push(this.updateItemDetail(itemId, detail));
            }
            const [itemResult, itemDescriptionResult] = await Promise.all(tasks);
            if(itemDescriptionResult){
                itemResult.description = itemDescriptionResult;
            }
            log.info('updateItem item : ', itemResult);
            return itemResult;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > updateItem : ', e);
            throw e;
        }
    }

    async setInvalidItemsByUserId(userId:number){
        try{
            const itemModel = this.models.getModel(ModelName.item);
            await itemModel.update({status:4}, {where: {userId:userId, status: {[Op.ne]: 3}}});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > setInvalidItemsByUserId : ', e);
            throw e;
        }
    }

    async getMyItemCount(userId:number):Promise<number>{
        try{
            const itemModel = this.models.getModel(ModelName.item);
            return await itemModel.count({where: {userId:userId, status: {[Op.ne]: 4}}});
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception > getMyItemCount : ', e);
            throw e;
        }
    }


    /*********************************************************************************
     * Category
     *********************************************************************************/
    async getCategoryList(categoryQuery: CategoryQueryInput, first?:number, last?:number, after?:string, before?:string): Promise<Category[]>{
        try{
            const cursor: CategoryModel[CursorName.createdAt] = CursorName.createdAt;
            let where: WhereOptions = {};
            let limit: number = 50;
            let order:string = 'DESC';

            if(categoryQuery){
                where = { ...where, ...categoryQuery};
            }
            if(after){
                where = { ...where, createdAt: {[Op.gt]: after}};
            }
            if(before){
                where = { ...where, createdAt: {[Op.lt]: before}};
            }
            if(first){
                limit = first;
                order = 'ASC';
            }
            if(last){
                limit = last;
                order = 'DESC'
            }
            const categoryModel = this.models.getModel(ModelName.category);
            const items = await categoryModel.findAll({
                where, 
                limit, 
                order:[[cursor, order]], 
                include: ['parent'],
                nest: true
            });
            if(last){
                items.sort((a:Item,b:Item)=>{
                    const aDate = new Date(a.createdAt).getTime();
                    const bDate = new Date(b.createdAt).getTime();
                    return bDate - aDate;
                });
            }
            return items;
        }catch(e){
            log.error('exception > getCategoryList : ', e);
            throw e;
        }
    }

    async getCategory(id: number): Promise<Category>{
        try{
            const categoryModel = this.models.getModel(ModelName.category);
            const result:Category = await categoryModel.findOne({
                where: {id: id},
                include: ['parent'],
                nest: true,
                raw: true
            });
            return result;
        }catch(e){
            log.error('exception > getCategoryItems : ', e);
            throw e;
        }
    }

    async scanCategory(): Promise<Category[]>{
        try{
            const cursor: CategoryModel[CursorName.createdAt] = CursorName.createdAt;
            let order:string = 'DESC';
            const categoryModel = this.models.getModel(ModelName.category);
            const categoryList:Category[] = await categoryModel.findAll({
                order:[[cursor, order]], 
                include: ['parent'],
                nest: true
            });
            return categoryList;
        }catch(e){
            log.error('exception > scanCategory : ', e);
            throw e;
        }
    }

    
}

export { ItemRepository, QueryOptions }