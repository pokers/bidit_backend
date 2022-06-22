import { DataTypes, Model, Sequelize } from 'sequelize';
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

interface PushTokenAttributes {
    status: number;
    userId?: number;
    token: string;
}
class PushTokenModel extends Model implements PushTokenAttributes{
    public id: number;
    public status: number;
    public userId: number;
    public token: string;
    public createdAt: string;
    public updatedAt: string;
    public deletedAt: string;

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
            userId:{
                type: INTEGER,
            },
            token:{
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
        },{
            sequelize: sequelize,
            modelName: 'PushTokenModel',
            tableName: 'pushToken',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { PushTokenModel, PushTokenAttributes }
    