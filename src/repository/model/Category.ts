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

class CategoryModel extends Model {
    public id!: number;
    public status: number;
    public parentId: number;
    public name: string;
    public depth: number;
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
            parentId:{
                type: INTEGER,
            },
            name:{
                type: STRING,
            },
            depth: {
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
            modelName: 'CategoryModel',
            tableName: 'category',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { CategoryModel }
