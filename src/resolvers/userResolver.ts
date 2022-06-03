import { log } from '../lib/logger'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import { AuroraMySql } from '../lib/auroraMySql'
import { dbConfig } from '../config';
import { UserService, ItemService } from '../services';
import { ItemRepository, UserRepository } from '../repository';
import { OrmSequlize } from '../lib/OrmSequlize'
import { Models } from '../repository/model'
import { Repos, User, ItemQueryInput, ItemConnection } from '../types'


// TODO : It should be updated/modified into Factory class.
const getUserService = async (auroraMySql?:AuroraMySql):Promise<UserService> =>{
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
        const userService = new UserService(provider);
        return userService;
    }catch(e){
        log.error('exception > ', e);
        throw e;
    }
}
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

// TODO : it should be placed in class such as UserResolver class.
const getUser = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        const getUser = async ():Promise<User>=>{
            return await (await getUserService()).getUser(event.arguments, event.info.selectionSetList);
        }
        const getItem = async ():Promise<ItemConnection>=>{
            if(event.info.selectionSetList?.indexOf('items') >= 0){
                const itemQuery:ItemQueryInput = {userId: event.arguments.id};
                event.arguments = { ...event.arguments, ...itemQuery }
                return await (await getItemService()).getItemList(event.arguments, event.info.selectionSetList);
            }
            return {};
        }
        const [user, items]= await Promise.all([getUser(), getItem()]);
        if(user){
            user.items = items;
        }
        log.info('result : ', user);
        return user;
    }catch(e){
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const userResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked userResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        switch(event.info.fieldName){
            case 'getUser':
                payload = await getUser(event);
                log.info('payload : ', payload)
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

export { userResolver }