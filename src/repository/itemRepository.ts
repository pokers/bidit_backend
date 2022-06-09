import { log } from '../lib/logger'
import { ItemModel, CategoryModel, ModelName, CursorName } from './model'
import { Op, WhereOptions } from 'sequelize'
import { Item, 
    ItemQueryInput, 
    ItemDescription, 
    ItemImage, 
    CategoryQueryInput, 
    FirstLastItem, 
    Category,
} from '../types'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'

@Service()
class ItemRepository extends RepositoryBase{
    // Private Methods

    // Public Methods
    async getItem(itemId:number): Promise<Item>{
        try{
            const model = this.models.getModel(ModelName.item);
            const result:Item = await model.findOne({
                where: {id: itemId},
                include: ['description', 'image', 'category']
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
                where: {id: itemId}
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

    async getFirstLastItem<T>(cursor: string, modelName:ModelName, query?: ItemQueryInput,): Promise<FirstLastItem<T>>{
        try{
            let result: FirstLastItem<T> = {} as FirstLastItem<T>;
            let where: WhereOptions = {};
            if(query){
                where = { ...where, ...query};
            }
            const model = this.models.getModel(modelName);
            const first = await model.findOne({
                // attributes: [cursor],
                where,
                limit: 1,
                order: [[cursor, 'ASC']]
            });
            log.info('First : ', first);

            const last = await model.findOne({
                // attributes: [cursor],
                where,
                limit: 1,
                order: [[cursor, 'DESC']]
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

    async getItemList(itemQuery?: ItemQueryInput, first?:number, last?:number, after?:string, before?:string): Promise<Item[]>{
        try{
            const cursor: ItemModel[CursorName.createdAt] = CursorName.createdAt;
            let where: WhereOptions = {};
            let limit: number = 50;
            let order:string = 'DESC';

            if(itemQuery){
                where = { ...where, ...itemQuery};
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
            const items = await itemModel.findAll({where, limit, order:[[cursor, order]], include: ['description', 'image', 'category']});
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
            const items = await categoryModel.findAll({where, limit, order:[[cursor, order]], include: ['parent']});
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
                include: ['parent']
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
            const categoryList:Category[] = await categoryModel.findAll({order:[[cursor, order]], include: ['parent']});
            return categoryList;
        }catch(e){
            log.error('exception > scanCategory : ', e);
            throw e;
        }
    }

    
}

export { ItemRepository }