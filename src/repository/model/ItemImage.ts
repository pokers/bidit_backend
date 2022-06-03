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

class ItemImageModel extends Model {
    public id!: number;
    public status: number;
    public itemId: number;
    public type: number;
    public url: string;
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
            url:{
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
            modelName: 'ItemImageModel',
            tableName: 'itemImage',
            timestamps: false,
            paranoid: true,
        });

        this.sync();
    }
}

export { ItemImageModel }


