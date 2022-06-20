import { Sequelize, DataTypes, Model } from 'sequelize';

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

interface ItemDescriptionAttributes {
    status: number;
    itemId: number;
    type: number;
    description: string;
}
class ItemDescriptionModel extends Model implements ItemDescriptionAttributes{
    public id!: number;
    public status: number;
    public itemId: number;
    public type: number;
    public description: string;
    public createdAt!: string;
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
            itemId:{
                type: INTEGER,
            },
            type:{
                type: INTEGER,
            },
            description:{
                type: TEXT,
            },
            createdAt:{
                type: STRING,
            },
            updatedAt:{
                type: STRING,
            },
            deletedAt:{
                type: STRING,
            }
        }, {
            sequelize: sequelize,
            modelName: 'ItemDescriptionModel',
            tableName: 'itemDescription',
            timestamps: false,
            paranoid: true,
        })

        this.sync();
    }
}

export { ItemDescriptionModel, ItemDescriptionAttributes }
