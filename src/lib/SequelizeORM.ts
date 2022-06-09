import { log } from './logger';
import { SecretMySql } from '../types';
import { SecretsManager } from 'aws-sdk';
import { Sequelize } from 'sequelize'
import mysql2 from 'mysql2'
import { Service } from 'typedi'

class SequelizeORM {
    private secretManager:SecretsManager;
    private dbInst:Sequelize = {} as Sequelize;
    private secret:SecretMySql = {} as SecretMySql;
    private _isConnected:Boolean = false;

    constructor(region:string){
        this.secretManager = new SecretsManager({ region: region});
    }

    // It's not singleton
    getDBInstance():Sequelize{
        return this.dbInst;
    }

    isConnected():Boolean{
        return this._isConnected;
    }

    async initialize(secretId: string): Promise<SequelizeORM>{
        try{
            let secMgr = await this.secretManager.getSecretValue({SecretId: secretId}).promise();
            this.secret = JSON.parse(secMgr.SecretString || "");
            // log.info('secret : ', this.secret);
            this.dbInst = new Sequelize({
                database: this.secret.dbName,
                username: this.secret.username,
                password: this.secret.password,
                host: this.secret.host,
                dialect: 'mysql',
                dialectModule: mysql2,
                define: {
                    timestamps: false
                },
                // timezone: "+09:00",
                logging: false,
                pool:{
                    max: 5,
                    min: 0,
                    idle:0,
                    acquire: 3000,
                }
            })
            await this.dbInst.authenticate();
            this._isConnected = true;
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }
}


// TODO : Refactorying should be applied on this.
// Currently It just use for compare and testing on the Lambda.
import { dbConfig } from '../config';
const sequelizeInst = new Sequelize(
    dbConfig.rdsMain.database,
    dbConfig.rdsMain.user,
    dbConfig.rdsMain.password,
    {
        dialect: 'mysql',
        dialectModule: mysql2,
        define: {
            timestamps: false
        },
        timezone: '+09:00',
        host: dbConfig.rdsMain.host,
        logging: false,
        pool:{
            max: 2,
            min: 0,
            idle:0,
            acquire: 3000,
        }
    },
);
export { SequelizeORM };


