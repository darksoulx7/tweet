resource "aws_elasticache_subnet_group" "elasticache_subnet_group" {
  name       = "${local.prefix}-subnet-elasticache-group"
  subnet_ids = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]
}

resource "aws_elasticache_replication_group" "chatapp_redis_cluster" {
  replication_group_id          = "${local.prefix}-redis"
  node_type                     = var.elasticache_node_type
  replication_group_description = "Redis elasticache replication group"
  automatic_failover_enabled    = false
  multi_az_enabled              = false
  number_cache_clusters         = 1
  parameter_group_name          = var.elasticache_parameter_group_name
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.elasticache_subnet_group.name
  security_group_ids            = [aws_security_group.elasticache_sg.id]

  depends_on = [aws_security_group.elasticache_sg]

  provisioner "local-exec" {
    command = "bash ./userdata/update-env-file.sh"

    environment = {
      ELASTICACHE_ENDPOINT = self.primary_endpoint_address
    }
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-elasticache" })
  )
}