pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
            args '--ipc=host' // Necesario para algunos tests
        }
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Instalar Playwright') {
            steps {
                sh 'npx playwright install' // Sin --with-deps
                sh 'npx playwright install-deps --dry-run' // Ver qué faltaría
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'npm run test'
            }
        }
    }
}