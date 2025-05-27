pipeline {
    agent any

    tools {
        nodejs('Node 22')
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

        stage('Ejecutar tests') {
            steps {
                sh 'npm run test'
            }
        }
    }
}
