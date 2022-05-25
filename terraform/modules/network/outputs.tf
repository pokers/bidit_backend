output "vpc_id" {
  value = "${aws_vpc.vpc.id}"
}
output "vpc_subnet_ids" {
  value = ["${aws_subnet.vpc_subnet.*.id}"]
}
output "vpc_security_group_id" {
  value = "${aws_security_group.vpc_seurity_group.id}"
}
output "vpc_outbound_subnet_id" {
  value = "${aws_subnet.private.id}"
}
output "vpc_outbound_security_group_id" {
  value = "${aws_security_group.sg.id}"
}
