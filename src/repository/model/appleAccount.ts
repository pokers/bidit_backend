import { DataTypes, Model, Sequelize } from 'sequelize';
import { AppleAuth, AppleIdTokenType } from '../../lib'
const {
    INTEGER,
    STRING,
    BOOLEAN,
    DATE,
    DATEONLY,
    UUID,
    UUIDV1,
    ENUM,
    TEXT,
    BIGINT,
} = DataTypes;

interface AppleAccountAttributes {
    status?:number;
    userId:number;
    sub:string;
    email:string;
    email_verified:boolean;
    is_private_email:boolean;
    real_user_status?:number;
}

class AppleAccountModel extends Model implements AppleAccountAttributes{
    public id:number;
    public status:number;
    public userId:number;
    public sub:string;
    public email:string;
    public email_verified:boolean;
    public is_private_email:boolean;
    public real_user_status:number;
    public createdAt?:string;
    public updatedAt?:string;
    public deletedAt?:string;
    public description?:string;
    
    static initialize(sequelize:Sequelize){
        this.init({
            id: {
                type: BIGINT,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            status:{
                type: INTEGER,
                allowNull: false,
            },
            userId:{
                type: INTEGER,
                allowNull: false,
            },
            sub:{
                type: STRING,
            },
            email:{
                type: STRING,
            },
            email_verified:{
                type: BOOLEAN
            },
            is_private_email:{
                type: BOOLEAN
            },
            real_user_status:{
                type: INTEGER
            },
            createdAt:{
                type: STRING
            },
            updatedAt:{
                type: STRING
            },
            deletedAt:{
                type: STRING
            },
            description:{
                type: STRING
            },
        },{
            sequelize: sequelize,
            modelName: 'AppleAccountModel',
            tableName: 'appleAccount',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { AppleAccountModel, AppleAccountAttributes, AppleIdTokenType }
    