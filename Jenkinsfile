pipeline {
    agent any

    tools {
        nodejs 'node-20'
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Checking out source code..."
                checkout scm
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {

                    if (env.BRANCH_NAME == 'staging') {
                        echo "🚀 Deploying Node App for branch: ${env.BRANCH_NAME}"

                        withCredentials([usernamePassword(
                            credentialsId: '46957a41-b9d8-40ec-8b21-3b41ecca86b9',
                            usernameVariable: 'DEPLOY_USER',
                            passwordVariable: 'DEPLOY_PASS'
                        )]) {

                            sh '''
                                #!/bin/bash
                                set -e

                                DEPLOY_HOST=192.168.1.38
                                DEPLOY_DIR=/opt/apps/chat-app

                                echo "📁 Creating directory on remote server..."
                                sshpass -p "$DEPLOY_PASS" ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST "mkdir -p $DEPLOY_DIR"

                                echo "📤 Copying project files to remote server..."
                                sshpass -p "$DEPLOY_PASS" rsync -av \
                                    --exclude=node_modules \
                                    --exclude=logs \
                                    --exclude=.git \
                                    -e "ssh -o StrictHostKeyChecking=no" \
                                    ./ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR

                                echo "🛠 Running remote setup + PM2 restart..."
                                sshpass -p "$DEPLOY_PASS" ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST "bash -s" << 'EOF'
                                    set -e
                                    cd /opt/apps/chat-app

                                    echo "📦 Installing production dependencies..."
                                    npm install

                                    echo "🔄 Restarting PM2 (staging)..."
                                    pm2 start ecosystem.config.js --env staging || pm2 restart ecosystem.config.js --env staging
                                    pm2 save

                                    echo "✅ Node.js application successfully deployed & restarted!"
EOF
                            '''
                        }
                    } else {
                        echo "⏭ Skipping deploy. Current branch: ${env.BRANCH_NAME}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful for branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "❌ Deployment failed for branch: ${env.BRANCH_NAME}"
        }
    }
}
