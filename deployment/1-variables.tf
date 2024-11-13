variable "aws_region" {
  description = "Default Region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr_block" {
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_availability_zones" {
  description = "VPC Availability Zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "vpc_public_subnets" {
  description = "VPC Public Subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vpc_private_subnets" {
  description = "VPC Private Subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "global_destination_cidr_block" {
  description = "CIDR Block for all IPs"
  type        = string
  default     = "0.0.0.0/0"
}

variable "bastion_host_cidr" {
  description = "CIDR Block for bastion Host Ingress"
  type        = string
  default     = "0.0.0.0/0"
}

variable "https_ssl_policy" {
  description = "HTTP SSL Policy"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}

variable "main_api_server_domain" {
  description = "Main Api Server Domain"
  type        = string
  default     = "ryomensukuna.xyz"
}

variable "dev_api_server_domain" {
  description = "Dev Api Server Domain"
  type        = string
  default     = "api.dev.ryomensukuna.xyz"
}

variable "ec2_iam_role_name" {
  description = "EC2 IAM Role Name"
  type        = string
  default     = "twitter-app-server-ec2-role"
}

variable "ec2_iam_role_policy_name" {
  description = "EC2 IAM Role Policy Name"
  type        = string
  default     = "twitter-app-server-ec2-role-policy"
}

variable "ec2_instance_profile_name" {
  description = "EC2 Instance Profile Name"
  type        = string
  default     = "twitter-app-server-ec2-instance-profile"
}

variable "elasticache_node_type" {
  description = "Elasticache Node Type"
  type        = string
  default     = "cache.t4g.micro"
}

variable "elasticache_parameter_group_name" {
  description = "Elasticache Parameter Group Name"
  type        = string
  default     = "default.redis7"
}

variable "ec2_instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.medium"
}

variable "bastion_host_type" {
  description = "Bastion Host Type"
  type        = string
  default     = "t2.micro"
}

variable "code_deploy_role_name" {
  description = "CodeDeploy IAM Role"
  type        = string
  default     = "twitter-app-server-codedeploy-role"
}

variable "prefix" {
  description = "Prefix to be added to AWS resources tags"
  type        = string
  default     = "twitter-app-server"
}

variable "project" {
  description = "Prefix to be added to AWS resources local tags"
  type        = string
  default     = "twitter-app-server"
}
