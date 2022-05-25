variable "vpc_name" {
  description = "name of vpc"
}
variable "vpc_cidr" {
  description = "vpc didr"
}
variable "subnet_cidrs" {
  description = "vpc didr"
  type = list
}
variable "vpc_availability_zones" {
  description = "vpc availability zone"
  type = list
  default = ["ap-northeast-2a", "ap-northeast-2c"]
}

variable "allowed_tcp_ports" {
  description = "list of port to be allowed"
  type = list
}
variable "port_descriptions" {
  description = ""
  type = list
}
