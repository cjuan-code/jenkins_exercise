pipeline {

    agent any

    parameters {
        string(name: 'ejecutor', description: 'persona que ejecuta la pipeline')
        string(name: 'motivo', description: 'motivo de la ejecución')
        string(name: 'correo_notify', description: 'email al que se enviará el correo')
    }
    
    triggers {
        pollSCM('* */3 * * *')
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
                    env.cypress_test_result = sh(script: "npm run cypress_run_test", returnStdout: true).trim()
                }
                // sh ' npm run cypress_run_test'
            }
        }

        stage('Update_Readme') {
            
        }

    }
}