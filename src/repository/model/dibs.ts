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

interface DibsAttributes {
    userId:number,
    itemId:number,
}
class DibsModel extends Model implements DibsAttributes{
    public id: number;
    public status: number;
    public userId: number;
    public itemId: number;
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
            itemId:{
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
            modelName: 'DibsModel',
            tableName: 'dibs',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { DibsModel, DibsAttributes }
    