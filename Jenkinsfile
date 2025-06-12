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
            message: "---------------------------------------------\n⏳ *Iniciando la integración* en `${env.JOB_NAME} #${env.BUILD_NUMBER}` ⏳"
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
            slackSend(
              channel: '#feedback', 
              message:
                "🧪❌ *Test unitarios fallidos*" +
                "🤖 *Explicación de la IA:* 🤖\n```\n${explanation.take(1000)}\n```\n"
            )
            
            error("Tests unitarios fallaron")
          } else {
            // Enviar notificación a Slack si los tests pasaron.
            slackSend(
              channel: '#feedback', 
              message: "🧪✅ *Tests Unitarios pasados exitosamente* "
            )
          }
        }
      }
    }

    stage('Test de Cobertura') {
      steps {
        script {
          // Redirigir la salida a un archivo
          def result = bat(script: 'npm run coverage > coverage-test-result.txt', returnStatus: true)

          // Usamos el token de OpenRouter para pedir la explicación de los errores.
          withCredentials([string(credentialsId: 'openrouter-api-key', variable: 'OPENROUTER_API_KEY')]) {
            bat 'npm run explain:coverage'
          }
          // Archivar el archivo que contiene la explicación de la IA.
          archiveArtifacts artifacts: 'coverage-test-explained.txt', fingerprint: true

          // Leer el archivo con la explicación generada por la IA.
          def explanation = fileExists('coverage-test-explained.txt')
              ? readFile('coverage-test-explained.txt').trim()
              : 'No se pudo generar una explicación del test de cobertura.'
          // Enviar notificación a Slack.
          slackSend(
            channel: '#feedback', 
            message:
              "📟✅ *Test de cobertura realizado* \n" +
              "🤖 *Explicación de la IA:* 🤖\n```\n${explanation.take(1000)}\n```\n"
          )
        }
      }
    }

    stage('Analizar la complejidad del código') {
      steps {
        script {
          // Redirigir la salida a un archivo
          def result = bat(script: 'npm run complejidad > complexity-results.txt', returnStatus: true)

          def explanation = fileExists('complexity-results.txt')
              ? readFile('complexity-results.txt').trim()
              : 'No se pudo generar un análisis de la complejidad.'

          slackSend(
            channel: '#feedback', 
            message:
              "🧩✅ *Analisis de la compejidad realizado* \n" +
              "```\n${explanation.take(1000)}\n```\n"
          )
        }
      }
    }

    stage('Build') {
      steps {
          script {
              // Ejecutar el build
              def result = bat(script: 'npm run build', returnStatus: true)

              // Verificar el estado del proceso de build
              if (result == 0) {
                  // Enviar notificación si el build fue exitoso
                  slackSend(
                      channel: '#feedback',
                      message: "🛠️✅ *Build exitoso* \n"
                  )
              } else {
                  // Enviar notificación si el build falló
                  slackSend(
                      channel: '#feedback',
                      message: "🔨❌ *Build fallido* \n"
                  )
                  error("El proceso de Build falló")
              }
            }
        }
    }


    stage('Deploy a Render') {
        steps {
            script {
                // Usamos la credencial desde el almacén de credenciales de Jenkins
                withCredentials([string(credentialsId: 'render-api-token', variable: 'RENDER_API_KEY')]) {
                    // Usamos la variable $RENDER_API_KEY en el bat
                    // Pasar la API Key de forma segura como variable de entorno en el script bat
                    def result = bat(script: """
                        set RENDER_API_KEY=${env.RENDER_API_KEY}
                        curl -s -o deploy-log.txt -w "%%{http_code}" -X POST "https://api.render.com/deploy/srv-d0v310a4d50c73e49s10?key=%RENDER_API_KEY%" > code.txt
                        set /p CODE=<code.txt
                    """, returnStatus: true)

                    // Leer el código de estado del despliegue
                    def deployStatus = readFile('code.txt').trim()

                    // Notificación a Slack dependiendo del resultado
                    if (deployStatus == "200") {
                        slackSend(
                            channel: '#feedback',
                            message: "🚀✅ Despliegue exitoso en Render\n" +
                                      "🔗 *URL de despliegue:* https://integracioncontinua-opr1.onrender.com\n"
                        )
                    } else {
                        slackSend(
                            channel: '#feedback',
                            message: "🚀❌ Error en el despliegue en Render\n" +
                                      "🔴 *Código de error:* ${deployStatus}"
                        )
                        error("Despliegue fallido con el código: ${deployStatus}")
                    }
                }
            }
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
          message:"⌛✅ *Integración finalizada* en `${env.JOB_NAME} #${env.BUILD_NUMBER}` ⌛"
        )
      }
    }

    failure {
      script {
        slackSend(
          channel: '#feedback', 
          message: "⌛❌ *Integración fallida* en `${env.JOB_NAME} #${env.BUILD_NUMBER}` ⌛"
        )
      }
    }
  }
}