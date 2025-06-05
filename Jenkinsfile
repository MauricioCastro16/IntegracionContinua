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

    stage('Test Unitarios') {
      steps {
        script {
          def result = bat(script: 'npm run test:unit > unit-test-result.txt', returnStatus: true)

          if (result != 0) {
            echo "❌ Hubo errores en los tests. Consultando IA..."
            withCredentials([string(credentialsId: 'openrouter-api-key', variable: 'OPENROUTER_API_KEY')]) {
              bat 'npm run explain:unit'
            }
            archiveArtifacts artifacts: 'unit-test-explained.txt', fingerprint: true

            // ⛔️ Marca explícitamente el build como fallido
            error("Tests unitarios fallaron")
          } else {
            echo "✅ Test unitarios exitosos"
          }
        }
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
                echo ❌ Deploy a Render falló con código %CODE%
                exit /b 1
            ) else (
                echo ✅ Deploy a Render exitoso con código %CODE%
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
        withCredentials([
          usernamePassword(credentialsId: 'jira-credentials', usernameVariable: 'JIRA_USER', passwordVariable: 'JIRA_TOKEN')
        ]) {
          bat 'echo JIRA_USER=%JIRA_USER% && echo JIRA_TOKEN=%JIRA_TOKEN%'
          bat 'npm run jira:update'
        }
      }
    }

  }
  post {
    success {
      script {
        def unitResult = readFile('unit-test-result.txt').trim()
        slackSend(channel: '#pruebas-unitarias', message:
          "✅ *Build Finalizado* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`\n" +
          "📦 *Tests Unitarios:* \n```\n${unitResult.take(300)}\n```\n" +
          "🔗 ${env.BUILD_URL}"
        )
      }
    }

    failure {
      def explanation = fileExists('unit-test-explained.txt')
        ? readFile('unit-test-explained.txt').trim()
        : 'No se pudo generar una explicación del error.'

      slackSend(channel: '#pruebas-unitarias', message:
        "❌ *Build fallido* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`\n" +
        "📦 *Explicación de la IA:*\n```\n${explanation.take(300)}\n```\n" +
        "🔗 ${env.BUILD_URL}"
      )
    }
  }
}
