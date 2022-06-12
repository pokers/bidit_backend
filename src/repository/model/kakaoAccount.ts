import { DataTypes, Model, Sequelize } from 'sequelize';
import { KakaoUserInfo, KakaoAccount } from '../../lib'
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
    BIGINT,
} = DataTypes;

class KakaoAccountModel extends Model {
    public id:number;
    public status:number;
    public userId:number;
    public profile_needs_agreement:boolean;
    public profile_nickname_needs_agreement:boolean;
    public profile_image_needs_agreement:boolean;
    public name_needs_agreement:boolean;
    public name:string;
    public email_needs_agreement:boolean;
    public is_email_valid:boolean;
    public is_email_verified:boolean;
    public email:string;
    public age_range_needs_agreement:boolean;
    public age_range:string;
    public birthyear_needs_agreement:boolean;
    public birthyear:string;
    public birthday_needs_agreement:boolean;
    public birthday:string;
    public birthday_type:string;
    public gender_needs_agreement:boolean;
    public gender:string;
    public phone_number_needs_agreement:boolean;
    public phone_number:string;
    public ci_needs_agreement:boolean;
    public ci:string;
    public ci_authenticated_at:string;             
    public nickname:string;
    public thumbnail_image_url:string;
    public profile_image_url:string;
    public is_default_image:boolean;
    public createdAt?:string;
    public updatedAt?:string;
    public deletedAt?:string;
    public description?:string;
    
    static initialize(sequelize:Sequelize){
        this.init({
            id: {
                type: BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            status:{
                type: INTEGER,
                allowNull: false,
            },
            userId:{
                type: INTEGER,
                allowNull: false,
            },
            profile_needs_agreement:{
                type: BOOLEAN
            },
            profile_nickname_needs_agreement:{
                type: BOOLEAN
            },
            profile_image_needs_agreement:{
                type: BOOLEAN
            },
            name_needs_agreement:{
                type: BOOLEAN
            },
            name:{
                type: STRING
            },
            email_needs_agreement:{
                type: BOOLEAN
            },
            is_email_valid:{
                type: BOOLEAN
            },                  
            is_email_verified:{
                type: BOOLEAN
            },               
            email:{
                type: STRING
            },
            age_range_needs_agreement:{
                type: BOOLEAN
            },
            age_range:{
                type: STRING
            },
            birthyear_needs_agreement:{
                type: BOOLEAN
            },
            birthyear:{
                type: STRING
            },
            birthday_needs_agreement:{
                type: BOOLEAN
            },
            birthday:{
                type: STRING
            },
            birthday_type:{
                type: STRING
            },
            gender_needs_agreement:{
                type: BOOLEAN
            },
            gender:{
                type: STRING
            },
            phone_number_needs_agreement:{
                type: BOOLEAN
            },
            phone_number:{
                type: STRING
            },
            ci_needs_agreement:{
                type: BOOLEAN
            },
            ci:{
                type: STRING
            },
            ci_authenticated_at:{
                type: STRING
            },
            nickname:{
                type: STRING
            },
            thumbnail_image_url:{
                type: STRING
            },
            profile_image_url:{
                type: STRING
            },
            is_default_image:{
                type: STRING
            },
            createdAt:{
                type: STRING
            },
            updatedAt:{
                type: STRING
            },
            deletedAt:{
                type: STRING
            },
            description:{
                type: STRING
            },
        },{
            sequelize: sequelize,
            modelName: 'KakaoAccountModel',
            tableName: 'kakaoAccount',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { KakaoAccountModel, KakaoUserInfo, KakaoAccount }
    