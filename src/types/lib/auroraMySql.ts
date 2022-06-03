
export interface SecretMySql {
    host: string;
    port: number;
    username: string;
    password: string;
    dbName: string;
}

export declare class AuroraMySql {
    private secret:SecretMySql;
    constructor(region:string);
    init(scriteId: string): Promise<AuroraMySql>;
    createConnection(): Promise<AuroraMySql>;
    beginTransaction(): Promise<AuroraMySql>;
    query(query: string):Promise<any>;
    commit(): Promise<AuroraMySql>;
    rollback(): Promise<AuroraMySql>;
    end(): Promise<AuroraMySql>;
}
