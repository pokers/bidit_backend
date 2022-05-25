provider "aws" {
  region  = "${var.region}"
  access_key = "${var.dev_access_key}"
  secret_key = "${var.dev_secret_key}"
}

module "vpc_db" {
  source = "./modules/network"
  vpc_name = "vpc_db"
  vpc_cidr   = "172.30.0.0/16"
  subnet_cidrs   = ["172.30.10.0/24", "172.30.20.0/24"]
  vpc_availability_zones = "${var.db_vpc_availability_zones}"
  allowed_tcp_ports = ["${var.db_rds_port}"]
  port_descriptions = [""]
}

module "main_rds" {
  source  = "terraform-aws-modules/rds-aurora/aws"

  name           = "aurora-db-mysql"
  engine         = "aurora-mysql"
  engine_version = "8.0.mysql_aurora.3.02.0"
  instance_class = "db.t3.medium"
  instances = {
    one = {}
    # 2 = {
    #   instance_class = "db.r6g.2xlarge"
    # }
  }

  vpc_id  = "${module.vpc_db.vpc_id}"
  vpc_security_group_ids = ["${module.vpc_db.vpc_security_group_id}"]
  subnets = ["subnet-0d59bf5163f388b48","subnet-0e98d11d6b43690a6"]

  # allowed_security_groups = ["${module.vpc_db.vpc_security_group_id}"]
  # allowed_cidr_blocks     = ["0.0.0.0/0"]

  storage_encrypted   = true
  apply_immediately   = true
  monitoring_interval = 10
  backup_retention_period = 1

  db_parameter_group_name         = "default"
  db_cluster_parameter_group_name = "default"

#   enabled_cloudwatch_logs_exports = ["mysql"]
  create_random_password = false
  master_username = "${var.db_rds_username}"
  master_password = "${var.db_rds_password}"
  database_name = "${var.db_rds_database_name}"
  publicly_accessible = true#"${var.db_rds_public}"
  port = "${var.db_rds_port}"
}