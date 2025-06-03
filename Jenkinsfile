pipeline {
  agent any
  tools {
      nodejs 'Node 20'
    }
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

    stage('Instalar Playwright Browsers') {
      steps {
        bat 'npx playwright install'
      }
    }


    stage('Test Unitarios') {
      steps {
        bat 'npm run test:unit > unit-test-result.txt || exit /b 1'
      }
    }

    stage('Test E2E') {
      steps {
        bat '''
          npm run test:e2e > e2e-test-result.txt 2>&1
          if %errorlevel% neq 0 (
            type e2e-test-result.txt
            exit /b 1
          )
        '''
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
            curl -s -o deploy-log.txt -w "%%{http_code}" -X POST "https://api.render.com/deploy/srv-d0v310a4d50c73e49s10?key=J82gTdp9yuE" > code.txt
            set /p CODE=<code.txt
            if NOT "%CODE%"=="200" (
                echo Deploy a Render falló con código %CODE%
                exit /b 1
            )
            '''
        }
    }

    stage('Publicar artefactos') {
      steps {
        archiveArtifacts artifacts: '*.txt', fingerprint: true
      }
    }

    stage('Actualizar Jira') {
      steps {
        bat 'npm run jira:update'
      }
    }
  }
  post {
    always {
      script {
        def unitResult = readFile('unit-test-result.txt').trim()
        def e2eResult = readFile('e2e-test-result.txt').trim()

        def summary = "✅ *Build Finalizado* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`\n" +
                      "📦 *Tests Unitarios:* \n```\n${unitResult.take(300)}\n```\n" +
                      "🎭 *Tests E2E:* \n```\n${e2eResult.take(300)}\n```\n" +
                      "🔗 ${env.BUILD_URL}"

        slackSend(channel: '#pruebas-unitarias', message: summary)
      }
    }

    failure {
      slackSend(channel: '#pruebas-unitarias', message: "❌ *Build fallido* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`\n🔗 ${env.BUILD_URL}")
    }
  }

}
