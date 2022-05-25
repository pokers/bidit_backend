resource "aws_vpc" "vpc" {
  cidr_block           = "${var.vpc_cidr}"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags={
    Name        = "${var.vpc_name}"
  }
}


resource "aws_internet_gateway" "this" {
  vpc_id = "${aws_vpc.vpc.id}"

  tags={
    Name = "${var.vpc_name}"
  }
}

resource "aws_route_table" "public" {
  vpc_id = "${aws_vpc.vpc.id}"

  tags={
    Name        = "${var.vpc_name}"
  }
}

resource "aws_route" "public_internet_gateway" {
  route_table_id         = "${aws_route_table.public.id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.this.id}"
}


resource "aws_subnet" "vpc_subnet" {
  count                   = "${length(var.vpc_availability_zones)}"

  vpc_id                  = "${aws_vpc.vpc.id}"
  cidr_block              = "${element(var.subnet_cidrs, count.index)}"
  availability_zone       = "${element(var.vpc_availability_zones, count.index)}"
  map_public_ip_on_launch = true

  tags={
    Name        = "${var.vpc_name}-${count.index}"
  }
}

resource "aws_route_table_association" "public" {
  count          = "${length(var.subnet_cidrs)}"
  subnet_id      = "${element(aws_subnet.vpc_subnet.*.id, count.index)}"
  route_table_id = "${aws_route_table.public.id}"
}

resource "aws_security_group" "vpc_seurity_group" {
  name        = "${var.vpc_name}-sg"
  description = "DB security group"
  vpc_id      = "${aws_vpc.vpc.id}"
  depends_on  = ["aws_vpc.vpc"]

  egress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags={
    Name = "${var.vpc_name}"
  }
}

resource "aws_security_group_rule" "default_ingress" {
  count = "${length(var.allowed_tcp_ports)}"

  type                     = "ingress"
  from_port                = "${element(var.allowed_tcp_ports, count.index)}"
  to_port                  = "${element(var.allowed_tcp_ports, count.index)}"
  protocol                 = "tcp"
  cidr_blocks              = ["0.0.0.0/0"]
  security_group_id        = "${aws_security_group.vpc_seurity_group.id}"
  description              = "${element(var.port_descriptions, count.index)}"
}

// subnet - private
resource "aws_subnet" "private" {
  vpc_id                  = "${aws_vpc.vpc.id}"
  availability_zone       = "${var.vpc_availability_zones[0]}"
  cidr_block = "172.30.30.0/24"

  tags={
    Name        = "${var.vpc_name}"
  }
}

// elastic IP - public
resource "aws_eip" "public" {
  vpc = true

  tags={
    Name        = "${var.vpc_name}"
  }
}

// NAT gateway - public
resource "aws_nat_gateway" "public" {
  allocation_id = "${aws_eip.public.id}"
  subnet_id = "${aws_subnet.vpc_subnet.0.id}"

  tags={
    Name        = "${var.vpc_name}"
  }
}

// Private - routing table
resource "aws_route_table" "private" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.public.id}"
  }
  
  tags={
    Name        = "${var.vpc_name}"
  }
}

resource "aws_route_table_association" "private" {
  subnet_id      = "${aws_subnet.private.id}"
  route_table_id = "${aws_route_table.private.id}"
}

resource "aws_security_group" "sg" {
  name        = "${var.vpc_name}-sg-egress"
  description = "${var.vpc_name}-sg"
  vpc_id      = "${aws_vpc.vpc.id}"

  egress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags={
    Name        = "${var.vpc_name}"
  }
}
