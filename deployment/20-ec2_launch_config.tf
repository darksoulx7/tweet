
resource "aws_launch_template" "asg_launch_configuration" {
  name          = "${local.prefix}-launch-config"
  image_id      = data.aws_ami.ec2_ami.id
  instance_type = var.ec2_instance_type
  key_name      = "twitterAppKeyPair"

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.autoscaling_group_sg.id]
  }
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_instance_profile.name
  }
  user_data = filebase64("${path.module}/userdata/user-data.sh")
  lifecycle {
    create_before_destroy = true
  }
}