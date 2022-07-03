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

interface PenaltyAttributes {
    status?: number;
    userId: number;
    type?: string;
    dueDate?: string;
    description?: string;
}
class PenaltyModel extends Model implements PenaltyAttributes{
    public id: number;
    public status: number;
    public userId: number;
    public type: string;
    public dueDate: string;
    public description: string;
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
            type:{
                type: STRING,
            },
            dueDate:{
                type: STRING,
            },
            description:{
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
            modelName: 'PenaltyModel',
            tableName: 'penalty',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { PenaltyModel, PenaltyAttributes }
    