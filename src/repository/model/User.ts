import { DataTypes, Model, Sequelize } from 'sequelize';
import { ItemConnection } from '../../types'
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
} = DataTypes;

interface UserAttributes {
    status: number;
    nickname?: string;
    passwd?: string;
    joinPath: string;
    gender?: string;
    birth?: string;
    email?: string;
    phone?: string;
    description?: string;
}
class UserModel extends Model implements UserAttributes{
    public id: number;
    public status: number;
    public nickname: string;
    public passwd: string;
    public joinPath: string;
    public gender: string;
    public birth: string;
    public email: string;
    public phone: string;
    public createdAt: string;
    public updatedAt: string;
    public deletedAt: string;
    public description: string;
    // public items:ItemConnection;

    // setItemConnection(items:ItemConnection){
    //     this.items = items;
    // }
    static initialize(sequelize:Sequelize){
        this.init({
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            status:{
                type: INTEGER,
            },
            nickname:{
                type: STRING,
            },
            passwd:{
                type: STRING,
            },
            joinPath: {
                type: STRING,
            },
            gender: {
                type: STRING,
            },
            birth: {
                type: STRING,
            },
            email:{
                type: STRING,
            },
            phone:{
                type: STRING,
            },
            createdAt:{
                type: STRING,
            },
            updatedAt:{
                type: STRING,
            },
            deletedAt:{
                type: STRING,
            },
            description: {
                type: STRING
            }
        },{
            sequelize: sequelize,
            modelName: 'UserModel',
            tableName: 'user',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { UserModel, UserAttributes }
    