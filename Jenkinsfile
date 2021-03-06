pipeline {

    agent any

    parameters {
        string(name: 'ejecutor', description: 'persona que ejecuta la pipeline', defaultValue: 'Cristian')
        string(name: 'motivo', description: 'motivo de la ejecución', defaultValue: 'new_changes')
        string(name: 'correo_notify', description: 'email al que se enviará el correo', defaultValue: 'cjuaniestacio@gmail.com')
    }
    
    triggers {
        pollSCM('H H/3 * * *')
    }

    environment {
        REPO_URL = credentials('Repo_gh')
        VERCEL_TOKEN = credentials('vercel_token')
        GOOGLE_PASSWORD = credentials('google_password')
    }
    
    stages {

        stage('Install dependences, build app and run app') {
            steps {
                sh ' npm install && npm install eslint && npm install nodemailer && npm run build && (npm run start&)'
            }
        }

        stage('Linter') {
            steps {
                script {
                    env.LINTER_RESULT = sh(script: 'npm run lint', returnStatus: true)
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    env.TEST_RESULT = sh(script: "./node_modules/.bin/cypress run ", returnStatus: true)
                }
            }
        }

        stage('Update_Readme') {
            steps {
                script {
                    env.UPDATE_RESULT = sh(script: "node ./jenkinsScripts/update_readme/index.js ${env.TEST_RESULT}", returnStatus: true)
                }
            }
        }

        stage('Push_Changes') {
            steps {
                sh "chmod +x ./jenkinsScripts/push_changes/push_changes.sh"
                sh "./jenkinsScripts/push_changes/push_changes.sh ${params.ejecutor} ${params.motivo} ${REPO_URL}"
            }
        }

        stage('Deploy_to_Vercel') {
            steps {
                sh "chmod +x ./jenkinsScripts/vercel_deploy/vercel_deploy.sh"
                script {
                    env.DEPLOY_RESULT = sh(script: "./jenkinsScripts/vercel_deploy/vercel_deploy.sh ${VERCEL_TOKEN} ${env.LINTER_RESULT} ${env.TEST_RESULT} ${env.UPDATE_RESULT}", returnStatus: true)
                }
            }
        }

        stage('Notificacion') {
            steps {
                sh "node ./jenkinsScripts/notificacion/index.js ${GOOGLE_PASSWORD} ${params.correo_notify} ${env.LINTER_RESULT} ${env.TEST_RESULT} ${env.UPDATE_RESULT} ${env.DEPLOY_RESULT}"
            }
        }

    }
}