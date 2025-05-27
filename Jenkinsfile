pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v $PWD:/app'
        }
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'docker', url: 'https://github.com/MauricioCastro16/IntegracionContinua'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
