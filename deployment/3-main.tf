terraform {
  backend "s3" {
    bucket  = "twitter-app-terraform-state"
    key     = "develop/twitter-app.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Ryomen Sukuna"
  }
}