pipeline {
    agent any

    tools {
        nodejs 'node-20'
    }

    environment {
        APP_DIR = "/opt/apps/chat-app"   // Your deployment folder
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Copy Files to App Directory') {
            steps {
                sh """
                mkdir -p $APP_DIR
                rsync -av --exclude=node_modules --exclude=logs ./ $APP_DIR
                """
            }
        }

        stage('PM2 Restart (Development)') {
            steps {
                sh """
                cd $APP_DIR
                npm install
                pm2 start ecosystem.config.js --env development || pm2 restart ecosystem.config.js --env development
                pm2 save
                """
            }
        }
    }

    post {
        success {
            echo "Development deployment completed successfully!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
