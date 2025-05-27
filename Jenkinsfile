pipeline {
    agent any

    tools {
        nodejs 'Node 20' // Asegurate de tener Node.js 20 instalado como herramienta global en Jenkins
    }

    stages {
        stage('Clonar repo') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                echo 'Instalando dependencias...'
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                echo 'Ejecutando tests...'
                sh 'npm run test'  // Usá el comando que hayas configurado, como `npm run test:unit` si usás Vitest
            }
        }

        stage('Construir imagen Docker') {
            steps {
                echo 'Construyendo imagen Docker...'
                sh 'docker build -t calculadora-exotica .'
            }
        }
    }

    post {
        success {
            echo '🚀 Integración continua exitosa!'
        }
        failure {
            echo '❌ Algo falló durante la integración continua.'
        }
    }
}
