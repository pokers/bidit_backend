import { log } from './logger';
import { SecretMySql } from '../types';
import { SecretsManager } from 'aws-sdk';
import { Sequelize, Transaction, UniqueConstraintError } from 'sequelize'
import mysql2 from 'mysql2'
import { Service } from 'typedi'

@Service()
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

    async startTransaction():Promise<Transaction>{
        return await this.dbInst.transaction();
    }
    async commit(transaction:Transaction){
        await transaction.commit();
    }
    async rollback(transaction:Transaction){
        await transaction.rollback();
    }

    async close(){
        try{
            if(this._isConnected){
                this._isConnected = false;
                await this.dbInst.connectionManager.close();  // For using the Lambda
                await this.dbInst.close();
                log.info('SequelizeORM : close ');
            }
        }catch(e){
            log.error("exception > ", e);
            throw e;
        }
    }

    async initialize(secretId: string): Promise<SequelizeORM>{
        try{
            if(!this._isConnected){
                this._isConnected = true;
                let secMgr = await this.secretManager.getSecretValue({SecretId: secretId}).promise();
                this.secret = JSON.parse(secMgr.SecretString || "");
                log.info('secret : ', this.secret);
                /**
                 * For the limitation between nodejs and sequelize, it's necessary below weired code.
                 * please ref : https://sequelize.org/docs/v7/other-topics/aws-lambda/
                 */
                if( this.dbInst.connectionManager){
                    log.info('SequelizeORM : reuse connect pool');
                    this.dbInst.connectionManager.initPools();
                    if(this.dbInst.connectionManager.hasOwnProperty("getConnection")){
                        delete this.dbInst.connectionManager.getConnection;
                    }
                }else{
                    log.info('SequelizeORM : Initialize connection pool');
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
                            max: 2,
                            min: 0,
                            idle:5000,
                            acquire: 10000,
                            evict: 10000
                        }
                    })
                    await this.dbInst.authenticate();
                }
            }
            return this;
        }catch(e){
            this._isConnected = false;
            log.error("exception > ", e);
            throw e;
        }
    }
}


// TODO : Refactorying should be applied on this.
// Currently It just use for compare and testing on the Lambda.
// import { dbConfig } from '../config';
// import { Service } from 'typedi';
// const sequelizeInst = new Sequelize(
//     dbConfig.rdsMain.database,
//     dbConfig.rdsMain.user,
//     dbConfig.rdsMain.password,
//     {
//         dialect: 'mysql',
//         dialectModule: mysql2,
//         define: {
//             timestamps: false
//         },
//         timezone: '+09:00',
//         host: dbConfig.rdsMain.host,
//         logging: false,
//         pool:{
//             max: 2,
//             min: 0,
//             idle:0,
//             acquire: 3000,
//         }
//     },
// );
export { SequelizeORM, Transaction, UniqueConstraintError };


