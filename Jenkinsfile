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

        stage('Install dependences') {
            steps {
                sh ' npm install && npm install eslint'
            }
        }

        stage('linter') {
            steps {
                sh ' npm run lint'
            }
        }

        stage('test') {
            steps {
                sh ' cypress run'
            }
        }

    }
}