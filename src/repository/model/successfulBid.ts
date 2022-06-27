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

interface SuccessfulBidAttributes {
    userId:number,
    itemId:number,
    biddingId:number
}
class SuccessfulBidModel extends Model implements SuccessfulBidAttributes{
    public id: number;
    public status: number;
    public userId: number;
    public itemId: number;
    public biddingId: number;
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
            biddingId:{
                type: INTEGER,
            },
            createdAt:{
                type: STRING,
            }
        },{
            sequelize: sequelize,
            modelName: 'SuccessfulBidModel',
            tableName: 'successfulBid',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { SuccessfulBidModel, SuccessfulBidAttributes }
    