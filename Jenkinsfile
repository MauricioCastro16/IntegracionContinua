pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/MauricioCastro16/IntegracionContinua.git', branch: 'main'
      }
    }

    stage('Instalar dependencias') {
      steps {
        bat 'npm install'
      }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
      }
    }

    stage('Deploy a Render') {
        steps {
            bat '''
                curl -s -o deploy-log.txt -w "%{http_code}" -X POST "https://api.render.com/deploy/srv-d0v310a4d50c73e49s10?key=J82gTdp9yuE" > code.txt
                set /p CODE=<code.txt
                if NOT "%CODE%"=="200" (
                    echo Deploy a Render falló con código %CODE%
                    exit /b 1
                )
                '''
        }
    }

  }
}
