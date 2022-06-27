
const dbConfig = {
    rdsMain:{
        host: (process.env.BIDIT_RDS_MAIN_HOST || ''),
        port: (process.env.BIDIT_RDS_MAIN_PORT || ''),
        user: (process.env.BIDIT_RDS_MAIN_USER || ''),
        password: (process.env.BIDIT_RDS_MAIN_PASS || ''),
        database: (process.env.BIDIT_RDS_MAIN_DATABASE || ''),
        secretId: (process.env.BIDIT_SECRET_MANAGER_RDS || 'mainDB'),
        region: (process.env.BIDIT_RDS_MAIN_REGION || 'ap-northeast-2')
    }
}

const devEnv = {
    logLevel: (process.env.LOG_LEVEL || 'info')
}
const kakaoEnv = {
    baseURL: (process.env.KAKAO_BASE_URL || '')

}
const sqsEnv = {
    bidQueue: (process.env.BIDIT_SQS_BID_QUEUE || '')
}
export { dbConfig, devEnv, kakaoEnv, sqsEnv }