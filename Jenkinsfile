pipeline {
    agent any

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
                sh 'npx playwright install --with-deps' // Instala dependencias del sistema automáticamente
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'npm run test'
            }
        }
    }
}