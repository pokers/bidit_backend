import { log } from '../lib/logger'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import { AuroraMySql } from '../lib/auroraMySql'
import { dbConfig } from '../config';
import { ItemService } from '../services';
import { ItemRepository, UserRepository } from '../repository';
import { OrmSequlize } from '../lib/OrmSequlize'
import { Models } from '../repository/model'
import { Repos } from '../types'




// TODO : It should be updated/modified into Factory class.
const getItemService = async (auroraMySql?:AuroraMySql):Promise<ItemService> =>{
    try{
        // Initialize ORM module
        const sequelize = new OrmSequlize(dbConfig.rdsMain.region);
        await sequelize.initialize(dbConfig.rdsMain.secretId);
        // Inject ORM into base models
        const models = (new Models()).initialize(sequelize).associateHasMany();

        // TODO : The instance of mysql2 moduel should be remove. It's only for development and testing, comparing to Sequelize ORM.
        // Initialize mysql2 
        // const dbInst:AuroraMySql = auroraMySql? auroraMySql:new AuroraMySql(dbConfig.rdsMain.region);
        // await dbInst.init(dbConfig.rdsMain.secretId);

        // initialize Repository Instances
        const buildRepositoryProvider = ()=>{
            const repositories:Repos = {}
            repositories.itemRepo = new ItemRepository(models);
            repositories.userRepo = new UserRepository(models);
            return function getRepo(name?:string){
                return name? repositories[name]:repositories;
            }
        }
        const provider = buildRepositoryProvider();

        // Inject repositories into service
        const itemService = new ItemService(provider);
        return itemService;
    }catch(e){
        log.error('exception > ', e);
        throw e;
    }
}


const itemResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked itemResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        switch(event.info.fieldName){
            case 'getItem':
                payload = await (await getItemService()).getItem(event.arguments, event.info.selectionSetList);
                break;
            case 'getItemList':
                payload = await (await getItemService()).getItemList(event.arguments, event.info.selectionSetList);
                break;
            case 'getCategoryList':
                payload = await (await getItemService()).getCategoryList(event.arguments);
                break;
            case 'getCategory':
                payload = await (await getItemService()).getCategory(event.arguments);
                break;
            case 'scanCategory':
                payload = await (await getItemService()).scanCategory();
                break;
            default:
                break;
        }
    }catch(e){
        log.error('Exception > ', e)
    }finally{
        return payload;
    }
}

export { itemResolver }