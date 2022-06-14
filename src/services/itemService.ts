import { 
    // Items
    Item, 
    ItemConnection, 
    ItemEdge, 
    
    // Category
    Category, 
    CategoryConnection, 
    
    // Page
    PageInfo, 
    FirstLastItem, 
    CategoryEdge,

    Repos
} from '../types';
import { ItemRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorNotSupportedParameters } from '../lib';
import { ModelName, CursorName, Order } from '../repository/model';
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
            const { itemQuery , first , last , after , before } = arg;
            console.log('arg : ', arg);
            if(first && last){
                throw ErrorNotSupportedParameters();
            }
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }

            let result: ItemConnection = {} as ItemConnection
            const order = first? Order.ASC:Order.DESC;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            
            const firstLastItem:FirstLastItem<Item> = await itemRepo.getFirstLastItem<Item>(CursorName.createdAt, ModelName.item, itemQuery);
            log.info('firstLastItem : ', firstLastItem);

            const itemList:Item[] = await itemRepo.getItemList(itemQuery, first, last, after, before);
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
}

export { ItemService }