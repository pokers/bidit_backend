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

interface UserAlarmAttributes {
    status?: number;
    userId: number;
    alarmId?: number;
}
class UserAlarmModel extends Model implements UserAlarmAttributes{
    public id: number;
    public status: number;
    public userId: number;
    public alarmId: number;
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
            alarmId:{
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
            },
        },{
            sequelize: sequelize,
            modelName: 'UserAlarmModel',
            tableName: 'userAlarm',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { UserAlarmModel, UserAlarmAttributes }
    