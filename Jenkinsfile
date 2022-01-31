pipeline {

    agent any

    parameters {
        string(name: 'ejecutor', description: 'persona que ejecuta la pipeline')
        string(name: 'motivo', description: 'motivo de la ejecución')
        string(name: 'correo_notify', description: 'email al que se enviará el correo')
    }
    
    triggers {
        pollSCM('H H/3 * * *')
    }
    
    stages {

        stage('Install dependences, build app and run app') {
            steps {
                sh ' npm install && npm install eslint && npm run build && (npm run start&)'
            }
        }

        stage('Linter') {
            steps {
                sh ' npm run lint'
            }
        }

        stage('Test') {
            steps {

                script {
                    env.TEST_RESULT = sh(script: "./node_modules/.bin/cypress run ",returnStatus:true)
                }

            }
        }

        stage('Update_Readme') {
            steps {
                sh "node ./jenkinsScripts/update_readme/index.js ${env.TEST_RESULT}"
            }
        }

        stage('Push_Changes') {
            steps {
                sh "chmod +x ./jenkinsScripts/push_changes/push_changes.sh"
                withCredentials([string(credentialsId: 'Repo_gh', variable: 'URL')]) {
                    sh "./jenkinsScripts/push_changes/push_changes.sh ${params.ejecutor} ${params.motivo} ${URL}"
                }
            }
        }

    }
}