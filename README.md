Automated CI/CD Pipeline for Java Application Deployment on AWS EC2
📌 Project Overview

This project demonstrates a complete CI/CD (Continuous Integration and Continuous Deployment) pipeline for deploying a Java application on an AWS EC2 instance using modern DevOps tools and practices.

The pipeline automates:

Code integration from GitHub
Build and testing using Jenkins
Code quality analysis with SonarQube
Security vulnerability scanning with Trivy
Automated deployment to AWS EC2

T


🏗️ Architecture


Developer → GitHub → Jenkins Pipeline → SonarQube Analysis → Trivy Scan → Build & Test → Deploy to AWS EC2
⚙️ Features
Automated build and deployment pipeline
Continuous Integration with Jenkins
Continuous Deployment to AWS EC2
Static code analysis using SonarQube
Security scanning using Trivy
GitHub webhook integration
Maven-based Java application build
Real-time deployment after every code push
📂 Project Structure
project-root/
│
├── src/
├── pom.xml
├── Jenkinsfile
├── README.md
└── target/
🔧 Prerequisites

Before setting up the project, ensure the following are installed:

Java JDK 17 (or compatible version)
Maven
Jenkins
Docker (optional)
SonarQube
Trivy
AWS EC2 Instance
Git
☁️ AWS EC2 Setup
1. Launch EC2 Instance
Select Ubuntu/Linux AMI
Configure Security Groups:
22 → SSH
8080 → Jenkins/Application
9000 → SonarQube
2. Install Required Packages
sudo apt update
sudo apt install openjdk-17-jdk maven git -y
🛠️ Jenkins Setup
Install Jenkins
sudo apt install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins

Access Jenkins:

http://<EC2-PUBLIC-IP>:8080
🔍 SonarQube Setup

Run SonarQube using Docker:

docker run -d --name sonarqube \
-p 9000:9000 sonarqube:lts-community

Access SonarQube:

http://<EC2-PUBLIC-IP>:9000
🛡️ Trivy Installation
sudo apt install wget apt-transport-https gnupg lsb-release -y

wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -

echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list

sudo apt update
sudo apt install trivy -y
🔗 GitHub Webhook Integration
Go to GitHub Repository

Navigate to:

Settings → Webhooks

Add webhook URL:

http://<JENKINS-IP>:8080/github-webhook/
Select:
Content type: application/json
Trigger: Just the push event
📜 Jenkins Pipeline (Jenkinsfile)

    pipeline {
    agent any
    environment{
        SONAR_HOME= tool "sonar"
    }

    tools {
        nodejs 'mynodejs'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checkout Stage'

                git branch: 'main',
                url: 'https://github.com/mantu6611/pipe.git'
            }
        }
        
        stage("SonarQube Quality Analysis") {

            steps {

                withSonarQubeEnv("sonar") {
                     sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=wonderlust -Dsonar.projectKey=wonderlust"
                }
            }
        }    
        stage('Build and Test') {
            steps {
                echo 'Build and Test Stage'

                sh 'npm install'

                sh './node_modules/mocha/bin/_mocha --exit ./test/test.js'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment Stage'

                sshagent(['my-ssh']) {

                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@23.20.219.196 << EOF

                    sudo apt update
                    sudo apt install -y nodejs npm git

                    sudo npm install -g pm2

                    rm -rf pipe

                    git clone https://github.com/mantu6611/pipe.git

                    cd pipe

                    npm install

                    pm2 delete nodeapp || true

                    pm2 start index.js --name nodeapp

                    pm2 save

EOF
                    '''
                }
            }
        }
    }

    post {

        success {
            echo 'Pipeline Executed Successfully'
        }

        failure {
            echo 'Pipeline Failed'
        }
    }
} 


▶️ Pipeline Workflow
Developer pushes code to GitHub
GitHub webhook triggers Jenkins job
Jenkins pulls latest code
SonarQube checks code quality
Trivy scans for vulnerabilities
Jenkins deploys application to AWS EC2
Application runs automatically on EC2

📊 Benefits of This Pipeline

Faster deployment cycles
Improved code quality
Automated security checks
Reduced manual errors
Continuous delivery and monitoring
Scalable DevOps workflow
