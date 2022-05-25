variable "name" {
  description = "name of this terraform"
}
variable "product_name" {
  description = "The name of product"
}
variable "environment" {
  description = "The environment"
}
variable "region" {
  description = "The region to use"
}
variable "sms_region" {
  description = "region to send SMS"
}
variable "codecommit_repositoryname" {
  description = "Repository name of AWS CodeCommit"
}
variable "codecommit_branchname" {
  description = "branch name of AWS CodeCommit"
}
variable "aws_access_key" {
  description = "access key of aws"
}
variable "aws_secret_key" {
  description = "secret key of aws"
}
variable "redis_endpoint_address" {
  description = "address of redis"
  default = ""
}
variable "redis_endpoint_port" {
  description = "address of redis"
  default = ""
}
variable "rds_write_endpoint" {
  description = "address of rds for write"
  default = ""
}
variable "rds_read_endpoint" {
  description = "address of rds for read"
  default = ""
}
variable "rds_endpoint_port" {
  description = "address of rds"
  default = ""
}
variable "rds_username" {
  description = "master username of rds"
  default = ""
}
variable "rds_password" {
  description = "master password of rds"
  default = ""
}
variable "rds_database_name" {
  description = "name of RDS database"
  default = ""
}
variable "dynamo_table" {
  description = "name of dynamoDB table"
  default = ""
}
variable "dynamo_deploy_table" {
  description = "name of deploy dynamoDB table"
  default = ""
}
variable "dynamo_note_table" {
  description = "name of note dynamoDB table"
  default = ""
}
variable "gateway_url" {
  description = "url of ECS"
  default = ""
}
variable "gateway_port" {
  description = "port number of ECS"
  default = ""
}
variable "vpc_enable" {
  description = "whether vpc enabled or not"
}
variable "vpc_security_group_id" {
  description = "security group id"
  default = ""
}
variable "vpc_subnet_id_1" {
  description = ""
  default = ""
}
variable "vpc_subnet_id_2" {
  description = ""
  default = ""
}
variable "vpc_outbound_security_group_id" {
  description = "security group id"
  default = ""
}
variable "vpc_outbound_subnet_id" {
  description = ""
  default = ""
}
variable "segway_client_id" {
  description = "client id for using segway REST API"
  default = ""
}
variable "segway_client_secret" {
  description = "client setret for using segway REST API"
  default = ""
}
variable "backend_version" {
  description = "backend version"
}
variable "iamport_key" {
  description = "iamport key"
  default = ""
}
variable "iamport_secret" {
  description = "iamport secret"
  default = ""
}
variable "slack_hook_url" {
  description = "slack hook url"
  default = ""
}
variable "slack_alert_hook_url" {
  description = "slack alert hook url"
  default = ""
}
variable "slack_segway_alert_code1" {
  description = "slack segway alert code 1 hoot url"
  default = ""
}
variable "slack_segway_alert_code2" {
  description = "slack segway alert code 2 hoot url"
  default = ""
}
variable "slack_segway_alert_code3" {
  description = "slack segway alert code 3 hoot url"
  default = ""
}
variable "slack_operation_hook_url" {
  description = "slack operation hoot url"
  default = ""
}
variable "s3_report_image" {
  description = "To store image of report"
  default = ""
}
variable "s3_deploy_spot_image" {
  description = "To store image/picture of deploy spot"
  default = ""
}
variable "s3_riding_data" {
  description = "To store ride start/stop location"
  default = ""
}
variable "s3_daily_report" {
  description = "To store daily report data"
  default = ""
}
variable "s3_parking_image" {
  description = "To store parking image data"
  default = ""
}
variable "s3_employee_job_image" {
  description = "To store employee job image"
  default = ""
}
variable "s3_analysis_data" {
  description = "To store analysis files"
  default = ""
}
variable "s3_notice_image" {
  description = "To store notice image"
  default = ""
}
variable "cognito_userpool_id" {
  description = "ID of cognito userpool"
  default = ""
}
variable "cognito_mgr_userpool_id" {
  description = "ID of MGR cognito userpool"
  default = ""
}
variable "crypto_key_aes256" {
  description = "Key of AES256"
  default = ""
}

variable "mailer_gmail_client_id" {
  description = "gmail client ID"
  default = ""
}

variable "mailer_gmail_client_secret" {
  description = "gmail client secret"
  default = ""
}

variable "mailer_gmail_refresh_token" {
  description = "gmail refresh token"
  default = ""
}

variable "mailer_gmail_access_token" {
  description = "gmail access token"
  default = ""
}

variable "lambda_vpc_security_group_id" {
  description = "security group id"
  default = ""
}
variable "lambda_vpc_subnet_private_id" {
  description = ""
  default = ""
}
variable "aligo_base_url" {
  default= ""
}
variable "aligo_port" {
  default= 443
}
variable "aligo_api_key" {
  default= ""
}
variable "aligo_user_id" {
  default= ""
}
variable "aligo_sender" {
  default= ""
}
variable "aligo_tok_base_url" {
  default=""
}
variable "aligo_sender_key" {
  default=""
}
variable "nice_aes256cbc_key" {
  default=""
}
variable "nice_sign_salt" {
  default=""
}
variable "nice_partner_code" {
  default=""
}
variable "google_version_api_key"{
  default=""
}
variable "websocket_admin_connection_path" {
  description = "connection path of aws apigateway websocket"
  default=""
}

variable "sqs_flo_payment_queue" {
  description = "aws sqs"
  default=""
}
#############################################
# channel talk
variable "channel_api_key" {
  default = ""
}
variable "channel_api_secret" {
  default = ""
}
#############################################
# discord
variable "discord_token" {
  default = ""
}
#############################################
# barobill
variable "barobill_common_api_url" {
  default=""
}
variable "barobill_bank_account_api_url" {
  default=""
}
variable "barobill_corp_id" {
  default=""
}
variable "barobill_corp_number" {
  default=""
}
variable "barobill_cert_key" {
  default=""
}
variable "barobill_id" {
  default=""
}