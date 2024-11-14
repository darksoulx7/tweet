#!/bin/bash

# Function to check if a program is installed
function program_is_installed {
  type "$1" &>/dev/null
  echo $?
}

# Update and install required packages
sudo yum update -y
sudo yum install -y ruby wget unzip

# Download and install AWS CodeDeploy Agent
cd /home/ec2-user
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto

# Install nvm (Node Version Manager) if Node.js is not installed
if [ "$(program_is_installed node)" -ne 0 ]; then
  # Download and install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Load nvm

  # Install Node.js LTS version
  nvm install --lts
  nvm use --lts
fi

# Check and install Git if not installed
if [ "$(program_is_installed git)" -ne 0 ]; then
  sudo yum install -y git
fi

# Check and install Docker if not installed
if [ "$(program_is_installed docker)" -ne 0 ]; then
  sudo amazon-linux-extras install -y docker
  sudo systemctl start docker
  sudo systemctl enable docker
  sudo docker run --name chatapp-redis -p 6379:6379 --restart always --detach redis
fi

# Check and install PM2 if not installed
if ! npm list -g pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

# Clone project repository and set up the application
cd /home/ec2-user

if [ ! -d "tweet" ]; then
  git clone -b master https://github.com/darksoulx7/tweet.git
fi
cd tweet 
npm install

# Sync environment files from S3 and set up the environment
aws s3 sync s3://twitter-env-files/backend/develop
unzip env-file.zip
cp .env.develop .env

# Build and start the application
npm run build
npm run start