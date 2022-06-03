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

class ItemModel extends Model {
    public id!: number;
    public status: number;
    public userId: number;
    public categoryId: number;
    public sPrice: number;
    public cPrice: number;
    public buyNow: number;
    public name: string;
    public title: string;
    public dueDate: string;
    public deliveryType: number;
    public sCondition: number;
    public aCondition: number;
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
            userId:{
                type: INTEGER,
            },
            categoryId:{
                type: INTEGER,
            },
            sPrice: {
                type: INTEGER,
            },
            cPrice: {
                type: INTEGER,
            },
            buyNow: {
                type: INTEGER,
            },
            name:{
                type: STRING,
            },
            title:{
                type: STRING,
            },
            dueDate:{
                type: STRING,
            },
            deliveryType: {
                type: INTEGER,
            },
            sCondition: {
                type: INTEGER,
            },
            aCondition: {
                type: INTEGER,
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
            modelName: 'ItemModel',
            tableName: 'item',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { ItemModel }
    