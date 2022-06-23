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

interface BiddingAttributes {
    status: number;
    itemId: number;
    price: number;
}
class BiddingModel extends Model implements BiddingAttributes{
    public id: number;
    public status: number;
    public userId: number;
    public itemId: number;
    public price: number;
    public createdAt: string;

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
            itemId:{
                type: INTEGER,
            },
            price:{
                type: INTEGER,
            },
            createdAt:{
                type: STRING,
            }
        },{
            sequelize: sequelize,
            modelName: 'BiddingModel',
            tableName: 'bidding',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { BiddingModel, BiddingAttributes }
    