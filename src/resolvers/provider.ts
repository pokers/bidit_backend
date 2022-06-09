import { SequelizeORM } from '../lib/SequelizeORM'

import { Models } from '../repository/model'
import { Repositories} from '../repository'

import { Services } from '../services'

import { log } from '../lib'
import { dbConfig } from '../config'
import { Service } from 'typedi'

@Service()
class Provider {
    private sequelize:SequelizeORM

    constructor(
        private models:Models,
        private repositories:Repositories,
        private services:Services){
    }

    async initialize(){
        try{
            this.sequelize = new SequelizeORM(dbConfig.rdsMain.region);
            await this.sequelize.initialize(dbConfig.rdsMain.secretId);
            this.models.initialize(this.sequelize).associateHasMany();
        }catch(e){
            log.error('exception > initialize : ', e);
            throw e;
        }        
    }
    async getServices(){
        try{
            return this.services;
        }catch(e){
            log.error('exception > getServices : ', e);
            throw e;
        }
    }
    async getRepositories(){
        try{
            return this.repositories;
        }catch(e){
            log.error('exception > getRepositories : ', e);
            throw e;
        }
    }

    public async destroy(){
        try{
            
        }catch(e){
            log.error('exception > destroy : ', e);
            throw e;
        }
    }
}

export { Provider };