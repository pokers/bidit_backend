import { log } from './logger';
import { SecretMySql } from '../types';
import { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import { SecretsManager } from 'aws-sdk';


class AuroraMySql {
    private secretManager:SecretsManager;
    private dbInst:Connection = {} as Connection;
    private secret:SecretMySql = {} as SecretMySql;
    private _isConnected:Boolean = false;

    constructor(region:string){
        this.secretManager = new SecretsManager({ region: region});
    }

    isConnected():Boolean{
        return this._isConnected;
    }
    async init(scriteId: string): Promise<AuroraMySql>{
        try{
            let secMgr = await this.secretManager.getSecretValue({SecretId: scriteId}).promise();
            this.secret = JSON.parse(secMgr.SecretString || "");
            log.info('secret : ', this.secret);
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async createConnection(): Promise<AuroraMySql> {
        try{
            log.info('connection info : ',this.secret.host,
            this.secret.port,
            this.secret.username,
            this.secret.password,
            this.secret.dbName);
            this.dbInst = await createConnection({
                host: this.secret.host,
                port: this.secret.port,
                user: this.secret.username,
                password: this.secret.password,
                database: this.secret.dbName
            });
            await this.dbInst.connect();
            this._isConnected = true;
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async beginTransaction(): Promise<AuroraMySql>{
        try{
            await this.dbInst.beginTransaction()
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async query(query: string):Promise<any>{
        try{
            log.info('Query : ', query)
            const [result, fields] = await this.dbInst.query<RowDataPacket[]>(query);
            return result;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async execute(query: string):Promise<any>{
        try{
            log.info('Query : ', query)
            const [result, fields] = await this.dbInst.execute<RowDataPacket[]>(query);
            return result;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async commit(): Promise<AuroraMySql>{
        try{
            await this.dbInst.commit()
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async rollback(): Promise<AuroraMySql>{
        try{
            await this.dbInst.rollback()
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }

    async end(): Promise<AuroraMySql>{
        try{
            await this.dbInst.end()
            this._isConnected = false;
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }
}

export { AuroraMySql }