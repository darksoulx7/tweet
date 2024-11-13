#!/bin/bash

function program_is_installed {
  # Default return value assuming the program is installed (1 means installed)
  local return_=1
  
  # Check if the program is installed using `type` and suppress output
  type $1 >/dev/null 2>&1 || return_=0  # If `type` fails, set return_=0
  
  # Output the result: 1 if installed, 0 if not
  echo "$return_"
}

# Ensure AWS CLI is available
if [ $(program_is_installed aws) == 0 ]; then
  echo "AWS CLI is not installed. Exiting."
  exit 1
fi

# Ensure zip is available, if not, install it (assuming Alpine Linux)
if [ $(program_is_installed zip) == 0 ]; then
  echo "zip is not installed, installing..."
  # Add installation command based on your system. Here is an example for Alpine Linux.
  # For Ubuntu/Debian, you would use `apt-get install zip -y`
  apk update && apk add zip
  if [ $? -ne 0 ]; then
    echo "Failed to install zip. Exiting."
    exit 1
  fi
fi

# Sync files from S3
echo "Syncing files from S3..."
aws s3 sync s3://twitter-env-files/backend/develop .

# Unzip env-file.zip and modify the .env file
unzip env-file.zip
cp .env.develop .env
rm .env.develop

# Replace REDIS_HOST with the correct value
sed -i -e "s|^REDIS_HOST=.*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT:6379|g" .env
echo "Updated REDIS_HOST in .env"

# Clean up and re-upload
rm -rf env-file.zip
cp .env .env.develop
zip env-file.zip .env.develop
echo "Uploading env-file.zip to S3..."
aws --region us-east-1 s3 cp env-file.zip s3://twitter-env-files/backend/develop/

# Final cleanup
rm -rf .env*
rm -rf env-file.zip
echo "Cleanup complete."