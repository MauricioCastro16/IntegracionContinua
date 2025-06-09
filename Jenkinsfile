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

    stage ('Anuncio slack de inicio') {
      steps {
        script {
          slackSend(
            channel: '#feedback', 
            message: "---------------------------------\n🚀 *Iniciando Build* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`"
          )
        }
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
          // Redirigir la salida a un archivo
          def result = bat(script: 'npm run test:unit > unit-test-result.txt', returnStatus: true)

          // Verificamos si los tests fallaron.
          if (result != 0) {
            echo "❌ Hubo errores en los tests. Consultando IA..."
            
            // Usamos el token de OpenRouter para pedir la explicación de los errores.
            withCredentials([string(credentialsId: 'openrouter-api-key', variable: 'OPENROUTER_API_KEY')]) {
              bat 'npm run explain:unit'
            }

            // Archivar el archivo que contiene la explicación de la IA.
            archiveArtifacts artifacts: 'unit-test-explained.txt', fingerprint: true

            // Leer el archivo con la explicación generada por la IA.
            def explanation = fileExists('unit-test-explained.txt')
                ? readFile('unit-test-explained.txt').trim()
                : 'No se pudo generar una explicación del error.'

            // Enviar notificación a Slack.
            slackSend(channel: '#feedback', message:
              "❌ *Test unitarios fallidos* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`\n" +
              "📦 *Explicación de la IA:*\n```\n${explanation.take(1000)}\n```\n" +
              "🔗 ${env.BUILD_URL}"
            )
            
            error("Tests unitarios fallaron")
          } else {
            echo "✅ Test unitarios exitosos"
            
            // Enviar notificación a Slack si los tests pasaron.
            slackSend(
              channel: 'feedback', 
              message: "📦 *Tests Unitarios pasados exitosamente 🆗"
            )
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
          bat 'npm run jira:update'
        }
      }
    }

  }
  post {
    success {
      script {
        slackSend(
          channel: '#feedback', 
          message:"✅ *Build Finalizado* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`"
        )
      }
    }

    failure {
      script {
        slackSend(
          channel: '#feedback', 
          message: "❌ *Build fallido* en `${env.JOB_NAME} #${env.BUILD_NUMBER}`"
        )
      }
    }
  }
}
