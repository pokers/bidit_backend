##############################################
# AWS Credential
variable "dev_access_key" {
  description = "access key for development account"
}
variable "dev_secret_key" {
  description = "secret key for development account"
}

variable "region" {
  description = ""
}

variable "db_vpc_availability_zones" {
  description = "Primary availablility zone"
  type = list
}
variable "db_rds_port" {
  description = "port of rds"
}
variable "db_rds_name" {
  description = "name of rds"
}
variable "db_rds_username" {
  description = "master account"
}
variable "db_rds_password" {
  description = "password of master account"
}
variable "db_rds_database_name" {
  description = "name of database"
}
variable "db_rds_public" {
  description = "Allow public access"
  default = false
}