pipeline {
    agent {
        docker {
            image 'node:20-bullseye' // Imagen con dependencias básicas
            args '--privileged' // Necesario para algunas dependencias de Playwright
        }
    }

    tools {
        nodejs('Node22')
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Instalar dependencias del sistema para Playwright') {
            steps {
                sh '''
                apt-get update
                apt-get install -y libglib2.0-0 \\
                    libnss3 \\
                    libnspr4 \\
                    libdbus-1-3 \\
                    libatk1.0-0 \\
                    libatk-bridge2.0-0 \\
                    libcups2 \\
                    libxcb1 \\
                    libxkbcommon0 \\
                    libatspi2.0-0 \\
                    libx11-6 \\
                    libxcomposite1 \\
                    libxdamage1 \\
                    libxext6 \\
                    libxfixes3 \\
                    libxrandr2 \\
                    libgbm1 \\
                    libpango-1.0-0 \\
                    libcairo2 \\
                    libasound2
                '''
            }
        }

        stage('Instalar navegadores Playwright') {
            steps {
                sh 'npx playwright install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'npm run test'
            }
        }
    }
}