import { SequelizeORM } from '../lib/SequelizeORM'

import { Models } from '../repository/model'
import { ItemRepository, UserRepository} from '../repository'

import { ItemService, UserService } from '../services'
import { Repos, Services, UserResolverService, ItemResolverService } from '../types'

import { log } from '../lib'
import { dbConfig } from '../config'

class Provider {
    private static instance:Provider|null = null;
    private isInitialized = false;

    private sequelize:SequelizeORM;
    private models:Models;
    private repositories:Repos;
    private services:Services;

    constructor(){
    }


    public static async getInstance():Promise<Provider>{
        try{
            if(this.instance){
                return this.instance;
            }
            this.instance = new Provider();
            await this.instance.initialize();
            this.instance.isInitialized = true;
            return this.instance;
        }catch(e){
            log.error('exception> getInstance : ', e);
            throw e;
        }
    }

    async initialize(){
        try{
            // Initialize ORM module
            this.sequelize = new SequelizeORM(dbConfig.rdsMain.region);
            await this.sequelize.initialize(dbConfig.rdsMain.secretId);
            // Inject ORM into base models
            this.models = (new Models()).initialize(this.sequelize).associateHasMany();
    
            // Inject Models into Repository
            this.repositories = {};
            this.repositories.itemRepo = new ItemRepository(this.models);
            this.repositories.userRepo = new UserRepository(this.models);
    
            // Inject repositories into service
            this.services = {};
            this.services.itemService = new ItemService(this.repositories);
            this.services.userService = new UserService(this.repositories);
        }catch(e){
            log.error('exception > initialize : ', e);
            throw e;
        }        
    }

    getUserResolverService():UserResolverService{
        try{
            return {
                userService: this.services.userService? this.services.userService: new UserService(this.repositories),
                itemService: this.services.itemService? this.services.itemService: new ItemService(this.repositories)
            }
        }catch(e){
            log.error('exception > getResolverService : ', e);
            throw e;
        }
    }

    getItemResolverService():ItemResolverService{
        try{
            return {
                userService: this.services.userService? this.services.userService: new UserService(this.repositories),
                itemService: this.services.itemService? this.services.itemService: new ItemService(this.repositories)
            }
        }catch(e){
            log.error('exception > getResolverService : ', e);
            throw e;
        }
    }

    public static async destroy(){
        try{
            if(this.instance){
                // To avoid "ConnectionManager.getConnection was called after the connection manager was closed" error
                // await this.instance.sequelize.getDBInstance().close();
                this.instance = null;
            }
        }catch(e){
            log.error('exception > destroy : ', e);
            throw e;
        }
    }
}

export { Provider };