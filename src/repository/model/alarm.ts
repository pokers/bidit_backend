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

interface AlarmAttributes {
    status?: number;
    type?: string;
    title?: string;
    content?: string;
}
class AlarmModel extends Model implements AlarmAttributes{
    public id: number;
    public status: number;
    public type: string;
    public title: string;
    public content: string;
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
            type:{
                type: STRING,
            },
            title:{
                type: STRING,
            },
            content:{
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
            modelName: 'AlarmModel',
            tableName: 'alarm',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { AlarmModel, AlarmAttributes }
    