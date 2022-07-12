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

interface ItemDetailAttributes {
    status: number;
    itemId: number;
    categoryId?: number;
    period?: number;
    type?: string;
    vendor?: string;
    battery?: string;
    flash?: string;
    ram?: string;
    size?: string;
    networkType?: string;
    weight?: string;
    cpu?: string;
    wire?: string;
    lens?: string;
    resolution?: string;
    cam?: string;
    warranty?: string;
}

class ItemDetailModel extends Model implements ItemDetailAttributes{
    public id: number;
    public status: number;
    public itemId: number;
    public categoryId: number;
    public period: number;
    public type: string;
    public vendor: string;
    public battery: string;
    public flash: string;
    public ram: string;
    public size: string;
    public networkType: string;
    public weight: string;
    public cpu: string;
    public wire: string;
    public lens: string;
    public resolution: string;
    public cam: string;
    public warranty: string;
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
            itemId:{
                type: INTEGER,
            },
            categoryId:{
                type: INTEGER,
            },
            period: {
                type: INTEGER,
            },
            type:{
                type: STRING,
            },
            vendor:{
                type: STRING,
            },
            battery:{
                type: STRING,
            },
            flash:{
                type: STRING,
            },
            ram:{
                type: STRING,
            },
            size:{
                type: STRING,
            },
            networkType:{
                type: STRING,
            },
            weight:{
                type: STRING,
            },
            cpu:{
                type: STRING,
            },
            wire:{
                type: STRING,
            },
            lens:{
                type: STRING,
            },
            resolution:{
                type: STRING,
            },
            cam:{
                type: STRING,
            },
            warranty:{
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
            }
        },{
            sequelize: sequelize,
            modelName: 'ItemDetailModel',
            tableName: 'itemDetail',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { ItemDetailModel, ItemDetailAttributes }
    