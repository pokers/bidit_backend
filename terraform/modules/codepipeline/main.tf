resource "aws_s3_bucket" "source" {
  bucket        = "${lower("${var.product_name}-${var.name}-bucket-${terraform.workspace}")}"
  acl           = "private"
  force_destroy = true
}

resource "aws_iam_role" "codepipeline_role" {
  name               = "${var.name == "lambda-analysis-scheduler"? "TR-pipeline-${var.name}-${terraform.workspace}":var.name == "lambda-admin-vpc"? "${var.name}-${terraform.workspace}":var.name == "lambda-admin-ext"? "${var.name}-${terraform.workspace}":var.name == "lambda-analysis-py"? "${var.name}-${terraform.workspace}":"${var.product_name}-${var.name}-codepipeline_role-${terraform.workspace}"}"
  description = "module.code_pipeline.codepipeline_role"
  assume_role_policy = "${file("${path.module}/policies/codepipeline_role.json")}"
}

/* ********************************************************
*   policies
******************************************************** */
data "template_file" "codepipeline_policy" {
  template = "${file("${path.module}/policies/codepipeline.json")}"

  vars {
    aws_s3_bucket_arn = "${aws_s3_bucket.source.arn}"
  }
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name   = "${var.product_name}-${var.name}-codepipeline_policy-${terraform.workspace}"
  role   = "${aws_iam_role.codepipeline_role.id}"
  policy = "${data.template_file.codepipeline_policy.rendered}"
}

/* ********************************************************
*  CodeBuild
******************************************************** */
resource "aws_iam_role" "codebuild_role" {
  name               = "${var.name == "lambda-analysis-scheduler"? "TR-build-${var.name}-${terraform.workspace}":"${var.product_name}-${var.name}-codebuild-role-${terraform.workspace}"}"
  /*name               = "${var.product_name}-${var.name}-codebuild-role-${terraform.workspace}"*/
  description = "${var.product_name}-module.code_pipeline.codebuild_role-${terraform.workspace}"
  assume_role_policy = "${file("${path.module}/policies/codebuild_role.json")}"
}

data "template_file" "codebuild_policy" {
  template = "${file("${path.module}/policies/codebuild_policy.json")}"

  vars {
    aws_s3_bucket_arn = "${aws_s3_bucket.source.arn}"
  }
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name        = "${var.product_name}-${var.name}-codebuild-policy-${terraform.workspace}"
  role        = "${aws_iam_role.codebuild_role.id}"
  policy      = "${data.template_file.codebuild_policy.rendered}"
}

data "template_file" "buildspec" {
  template = "${file("${path.module}/buildspec_${var.name}.yml")}"

  vars {
    product_name       = "${var.product_name}"
    build_environment  = "${var.environment}"
    region             = "${var.region}"
    sms_region         = "${var.sms_region}"
    aws_access_key     = "${var.aws_access_key}"
    aws_secret_key     = "${var.aws_secret_key}"
    sls_config_file    = "serverless_${var.name}.yml"
    redis_endpoint_address = "${var.redis_endpoint_address}"
    redis_endpoint_port    = "${var.redis_endpoint_port}"
    rds_write_endpoint = "${var.rds_write_endpoint}"
    rds_read_endpoint = "${var.rds_read_endpoint}"
    rds_endpoint_port    = "${var.rds_endpoint_port}"
    rds_username = "${var.rds_username}"
    rds_password = "${var.rds_password}"
    rds_database_name = "${var.rds_database_name}"
    gateway_url = "${var.gateway_url}"
    gateway_port = "${var.gateway_port}"
    vpc_security_group_id = "${var.vpc_security_group_id}"
    vpc_subnet_id_1 = "${var.vpc_subnet_id_1}"
    vpc_subnet_id_2 = "${var.vpc_subnet_id_2}"
    segway_client_id = "${var.segway_client_id}"
    vpc_outbound_subnet_id = "${var.vpc_outbound_subnet_id}"
    vpc_outbound_security_group_id = "${var.vpc_outbound_security_group_id}"
    segway_client_secret = "${var.segway_client_secret}"
    backend_version = "${var.backend_version}"
    aws_account_type = "${terraform.workspace == "default"? "dev":"service"}"
    iamport_key = "${var.iamport_key}"
    iamport_secret = "${var.iamport_secret}"
    slack_hook_url = "${var.slack_hook_url}"
    slack_alert_hook_url = "${var.slack_alert_hook_url}"
    slack_segway_alert_code1 = "${var.slack_segway_alert_code1}"
    slack_segway_alert_code2 = "${var.slack_segway_alert_code2}"
    slack_segway_alert_code3 = "${var.slack_segway_alert_code3}"
    slack_operation_hook_url = "${var.slack_operation_hook_url}"
    dynamo_table = "${var.dynamo_table}"
    dynamo_deploy_table = "${var.dynamo_deploy_table}"
    dynamo_note_table = "${var.dynamo_note_table}"
    s3_report_image = "${var.s3_report_image}"
    s3_deploy_spot_image = "${var.s3_deploy_spot_image}"
    s3_riding_data = "${var.s3_riding_data}"
    s3_daily_report = "${var.s3_daily_report}"
    s3_parking_image = "${var.s3_parking_image}"
    s3_employee_job_image = "${var.s3_employee_job_image}"
    s3_analysis_data = "${var.s3_analysis_data}"
    s3_notice_image = "${var.s3_notice_image}"
    cognito_userpool_id = "${var.cognito_userpool_id}"
    cognito_mgr_userpool_id = "${var.cognito_mgr_userpool_id}"
    crypto_key_aes256 = "${var.crypto_key_aes256}"
    mailer_gmail_client_id = "${var.mailer_gmail_client_id}"
    mailer_gmail_client_secret = "${var.mailer_gmail_client_secret}"
    mailer_gmail_refresh_token = "${var.mailer_gmail_refresh_token}"
    mailer_gmail_access_token = "${var.mailer_gmail_access_token}"
    lambda_vpc_security_group_id = "${var.lambda_vpc_security_group_id}"
    lambda_vpc_subnet_private_id = "${var.lambda_vpc_subnet_private_id}"
    aligo_base_url = "${var.aligo_base_url}"
    aligo_port = "${var.aligo_port}"
    aligo_api_key = "${var.aligo_api_key}"
    aligo_user_id = "${var.aligo_user_id}"
    aligo_sender = "${var.aligo_sender}"
    aligo_tok_base_url = "${var.aligo_tok_base_url}"
    aligo_sender_key = "${var.aligo_sender_key}"
    nice_aes256cbc_key = "${var.nice_aes256cbc_key}"
    nice_sign_salt = "${var.nice_sign_salt}"
    nice_partner_code = "${var.nice_partner_code}"
    google_version_api_key = "${var.google_version_api_key}"
    websocket_admin_connection_path = "${var.websocket_admin_connection_path}"
    sqs_flo_payment_queue = "${var.sqs_flo_payment_queue}"
    channel_api_key = "${var.channel_api_key}"
    channel_api_secret = "${var.channel_api_secret}"
    discord_token = "${var.discord_token}"
    barobill_common_api_url = "${var.barobill_common_api_url}"
    barobill_bank_account_api_url = "${var.barobill_bank_account_api_url}"
    barobill_corp_id = "${var.barobill_corp_id}"
    barobill_corp_number = "${var.barobill_corp_number}"
    barobill_cert_key = "${var.barobill_cert_key}"
    barobill_id = "${var.barobill_id}"
  }
}


resource "aws_codebuild_project" "codebuild_project" {
  name          = "${var.product_name}-${var.name}-codebuild_project-${terraform.workspace}"
  build_timeout = "20"
  service_role  = "${aws_iam_role.codebuild_role.arn}"

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/amazonlinux2-x86_64-standard:3.0"
    #image           = "${var.name == "lambda-analysis-py"||var.name == "lambda-analysis"? "aws/codebuild/amazonlinux2-x86_64-standard:3.0":"aws/codebuild/nodejs:8.11.0"}"
    type            = "LINUX_CONTAINER"
    privileged_mode = false
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "${data.template_file.buildspec.rendered}"
  }
}

/* CodePipeline */
# Service Codepipeline
resource "aws_codepipeline" "codepipeline_service" {
  count    = "${terraform.workspace == "default"? 0:1}"
  name     = "${var.product_name}-${var.name}-codepipeline-${terraform.workspace}"
  role_arn = "${aws_iam_role.codepipeline_role.arn}"

  artifact_store {
    location = "${aws_s3_bucket.source.bucket}"
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeCommit"
      version          = "1"
      output_artifacts = ["source"]

      configuration {
        RepositoryName = "${var.codecommit_repositoryname}"
        BranchName = "${var.codecommit_branchname}"
      }
    }
  }

  stage {
    name = "Approve"

    action {
      name     = "Approval"
      category = "Approval"
      owner    = "AWS"
      provider = "Manual"
      version  = "1"
    }
  }

  stage {
    name = "deploy"

    action {
      name             = "deploy"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["source"]

      configuration {
        ProjectName = "${aws_codebuild_project.codebuild_project.name}"
      }
    }
  }
}

# Dev codepipeline
resource "aws_codepipeline" "codepipeline_default" {
  count    = "${terraform.workspace == "default"? 1:0}"
  name     = "${var.product_name}-${var.name}-codepipeline-${terraform.workspace}"
  role_arn = "${aws_iam_role.codepipeline_role.arn}"

  artifact_store {
    location = "${aws_s3_bucket.source.bucket}"
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeCommit"
      version          = "1"
      output_artifacts = ["source"]

      configuration {
        RepositoryName = "${var.codecommit_repositoryname}"
        BranchName = "${var.codecommit_branchname}"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["source"]

      configuration {
        ProjectName = "${aws_codebuild_project.codebuild_project.name}"
      }
    }
  }

  stage {
    name = "Approve"

    action {
      name     = "Approval"
      category = "Approval"
      owner    = "AWS"
      provider = "Manual"
      version  = "1"
    }
  }

}
