import { 
    // Items
    Item, 
    ItemConnection, 
    ItemEdge,
    ItemImage, 
    ItemQueryInput,
    
    // Category
    Category, 
    CategoryConnection, 
    
    // Page
    PageInfo, 
    FirstLastItem, 
    CategoryEdge,

    AuthResult
} from '../types';
import { ItemRepository, QueryOptions } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorNotSupportedParameters, ErrorInvalidBodyParameter, ErrorUserNotFound } from '../lib';
import { ModelName, CursorName, Order, Transaction } from '../repository/model';
import { Service } from 'typedi'
import { ServiceBase } from './serviceBase'

enum DefaultDate {
    PAST='2022-01-01 00:00:00',
    FUTURE='2999-01-01 00:00:00'
}
interface defaultRowInfo {
    createdAt: string
}

@Service()
class ItemService extends ServiceBase{
    
    // Private Methods
    private buildPageInfo<T extends defaultRowInfo>(firstLast: FirstLastItem<T>, items:T[], order:Order):PageInfo{
        try{
            const pageInfo:PageInfo = {
                startCursor: null,
                endCursor: null,
                hasNextPage: false,
                hasPrevPage: false
            }

            const startItemOfListDate = new Date(items.length > 0 ? items[0].createdAt:DefaultDate.PAST).getTime();
            const endItemOfListDate = new Date(items.length > 0? items[items.length - 1].createdAt:DefaultDate.FUTURE).getTime();
            const firstItemDate = new Date(firstLast.first? firstLast.first.createdAt:DefaultDate.PAST).getTime();
            const lastItemDate = new Date(firstLast.last? firstLast.last.createdAt:DefaultDate.PAST).getTime();

            log.info('list : ', startItemOfListDate, endItemOfListDate);
            log.info('DB : ', firstItemDate, lastItemDate);

            pageInfo.startCursor = items.length > 0? items[0].createdAt:null;
            pageInfo.endCursor = items.length > 0? items[items.length - 1].createdAt:null;
            if(order === Order.ASC){
                pageInfo.hasNextPage = (lastItemDate > endItemOfListDate);
                pageInfo.hasPrevPage = (firstItemDate < startItemOfListDate);
            }else{
                pageInfo.hasNextPage = (firstItemDate < endItemOfListDate);
                pageInfo.hasPrevPage = (lastItemDate > startItemOfListDate);
            }

            return pageInfo;
        }catch(e){
            log.error('Exception > buildPageInfo : ', e);
            throw e;
        }
    }

    // Public Methods
    async getItem(arg: any, selectionSetList:string[]): Promise<Item>{
        try{
            const { id } = arg;
            let result:Item = {} as Item;

            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            result = await itemRepo.getItem(id);
            log.info('Item : ', JSON.stringify(result));
            return result;
        }catch(e){
            log.error('exception > getItem:  ', e);
            throw e;
        }
    }

    async getItemList(arg: any, selectionSetList:string[]): Promise<ItemConnection>{
        try{
            const { itemQuery, keyword, first , last , after , before, cursorType } = arg;
            
            if(first && last){
                throw ErrorNotSupportedParameters();
            }
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }

            let result: ItemConnection = {} as ItemConnection
            const order = first? Order.ASC:Order.DESC;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            
            const firstLastItem:FirstLastItem<Item> = await itemRepo.getFirstLastItem<Item>(cursorType||CursorName.createdAt, ModelName.item, itemQuery, keyword);
            log.info('firstLastItem : ', firstLastItem);

            const itemList:Item[] = await itemRepo.getItemList(itemQuery, keyword, first, last, after, before, cursorType);
            log.info('item List : ', JSON.stringify(itemList));

            const totalCount = itemList.length;
            const edges: ItemEdge[] = itemList.map((item)=>({
                node: item,
                cursor: new Date(item.createdAt?item.createdAt:DefaultDate.PAST).toISOString()
            }));

            result.totalCount = totalCount;
            result.edges = edges;
            result.pageInfo = this.buildPageInfo<Item>(firstLastItem, itemList, order);

            log.info('getItemList : ', result);
            return result;
        }catch(e){
            log.error('exception > getItemList : ', e);
            throw e;
        }
    }

    async addItem(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Item>{
        let transaction:Transaction|null = null;
        try{
            const { itemAdd, description, images } = arg;

            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }
            if(!itemAdd){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            transaction = await this.startTransaction();
            const newItem:Item = await itemRepo.addItem(authInfo.userId, itemAdd, transaction, description, images);
            await this.commit(transaction);
            transaction = null;

            const result:Item = await this.getItem({id:newItem.id}, selectionSetList);
            log.info('addItem result : ', result);
            
            return result;
        }catch(e){
            if(transaction){
                await this.rollback(transaction);
            }
            log.error('exception > addItem : ', e);
            throw e;
        }
    }

    async updateItem(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Item>{
        try{
            const { itemId, itemUpdate, description } = arg;

            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }
            if(!itemUpdate){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const newItem:Item = await itemRepo.updateItem(itemId, itemUpdate, description);

            const result:Item = await this.getItem({id:itemId}, selectionSetList);
            log.info('updateItem result : ', result);
            
            return result;
        }catch(e){
            log.error('exception > updateItem : ', e);
            throw e;
        }
    }

    

    async updateItemImage(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<ItemImage>{
        try{
            const { itemId, itemImageUpdate} = arg;

            if(!itemImageUpdate){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }

            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const itemImage = await itemRepo.updateItemImage(itemId, itemImageUpdate);

            return itemImage;
        }catch(e){
            log.error('exception > updateItemImage : ', e);
            throw e;
        }
    }


    async getCategoryList(arg: any): Promise<CategoryConnection>{
        try{
            const { categoryQuery , first , last , after , before } = arg;
            
            if(first && last){
                throw ErrorNotSupportedParameters();
            }
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
 
            let result: CategoryConnection = {} as CategoryConnection;
            const order = first? Order.ASC:Order.DESC;

            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const firstLastItem:FirstLastItem<Category> = await itemRepo.getFirstLastItem<Category>(CursorName.createdAt, ModelName.category, categoryQuery);
            log.info('FirstLast : ', JSON.stringify(firstLastItem));

            const categoryList:Category[] = await itemRepo.getCategoryList(categoryQuery, first, last, after, before);
            log.info('category List : ', JSON.stringify(categoryList));

            const totalCount = categoryList.length;
            const edges: CategoryEdge[] = categoryList.map((item)=>({
                node: item,
                cursor: new Date(item.createdAt?item.createdAt:DefaultDate.PAST).toISOString()
            }));

            result.totalCount = totalCount;
            result.edges = edges;
            result.pageInfo = this.buildPageInfo<Category>(firstLastItem, categoryList, order);

            return result;
        }catch(e){
            log.error('exception > getCategoryList : ', e);
            throw e;
        }
    }

    async getCategory(arg: any): Promise<Category>{
        try{
            const { id } = arg;

            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const category:Category = await itemRepo.getCategory(id);

            return category;
        }catch(e){
            log.error('exception > getCategory : ', e);
            throw e;
        }
    }

    async scanCategory(): Promise<Category[]>{
        try{
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const categoryList:Category[] = await itemRepo.scanCategory();

            return categoryList;
        }catch(e){
            log.error('exception > scanCategory : ', e);
            throw e;
        }
    }

    async getEndingSoonItems(arg: any, selectionSetList:string[]):Promise<Item[]>{
        try{
            const { itemQuery, keyword, count } = arg;
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const first = this.getTimeNow().toISOString();
            console.log('getEndingSoonItems first : ', first);
            const queryOptions:QueryOptions = {
                keyword: keyword,
                start: this.getTimeNow().toISOString(),
                order: Order.ASC,
                limit: count
            }
            const itemList:Item[] = await itemRepo.getItemsByDueDate(itemQuery, queryOptions, ['description', 'image', 'category'])
            log.info('svc > getEndingSoonItems > itemList : ', itemList);

            return itemList;
        }catch(e){
            log.error('exception > scanCategory : ', e);
            throw e;
        }
    }
}

export { ItemService }