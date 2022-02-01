# Jenkins

## ¿Qué es Jenkins?

Jenkins es un servidor automatizado de integración continua de código abierto capaz de organizar una cadena de acciones que ayudan a lograr el proceso de integración continua (y mucho más) de manera automatizada.

La razón por la que Jenkins se hizo tan popular es porque se encarga de supervisar las tareas repetitivas que surgen dentro del desarrollo de un proyecto.

Además, Jenkins puede ser implementado a lo largo de todo el ciclo de vida completo del desarrollo.

Desde la fase construcción inicial, la fase de pruebas, en la documentación del software, en su implementación y en todas las demás etapas existentes dentro del ciclo de vida que desees aplicar.

## Creación de la pipeline para el proyecto
Primero creamos la tarea de tipo Pipeline en Jenkins
![j0](https://user-images.githubusercontent.com/79716922/151997259-51cac415-d91a-49f6-b105-2dcbf6e2e165.png)

Ahora toca configurar la pipeline, pondremos la URL al proyecto y la ubicación del archivo Jenkinsfile.
![j01](https://user-images.githubusercontent.com/79716922/151997260-72a1b849-9f7d-41b7-b082-43d0e631a3be.png)

### Jenkinsfile

Partiremos de unos parámetros de entrada en jenkins, que son los siguientes:
``` 
parameters {
  string(name: 'ejecutor', description: 'persona que ejecuta la pipeline', defaultValue: 'Cristian')
  string(name: 'motivo', description: 'motivo de la ejecución', defaultValue: 'new_changes')
  string(name: 'correo_notify', description: 'email al que se enviará el correo', defaultValue: 'cjuaniestacio@gmail.com')
}
```
También consta un cron que se encarga de comprobar cada 3 horas si hay cambios en el repositorio, en caso afirmativo se ejecuta la pipeline.
```
triggers {
  pollSCM('H H/3 * * *')
}
```
Guardaremos en variables de entorno las credenciales necesarias para el correcto funcionamiento de la pipeline.
```
environment {
  REPO_URL = credentials('Repo_gh')
  VERCEL_TOKEN = credentials('vercel_token')
  GOOGLE_PASSWORD = credentials('google_password')
}
```
### Stages
El primer stage se encarga de instalar las dependencias necesarias, construir y poner en marcha la aplicación de next del proyecto.
```
stage('Install dependences, build app and run app') {
  steps {
    sh ' npm install && npm install eslint && npm install nodemailer && npm run build && (npm run start&)'
  }
}
```
El segundo stage se encarga de realizar el eslint al proyecto y guarda el resultado para posteriores comprobaciones.
```
stage('Linter') {
  steps {
    script {
      env.LINTER_RESULT = sh(script: 'npm run lint', returnStatus: true)
    }
  }
}
```
En caso de que haya algún error de linting nos lo muestra, en caso de que no, nos muestra lo siguiente:
![no_eslint_errors](https://user-images.githubusercontent.com/79716922/152013654-46c19847-2d0d-41cb-8e97-8c77aec5fbd0.png)

El tercer stage se encarga de realizar los test con cypress y guarda el resultado igual que el stage anterior.
```
stage('Test') {
  steps {
    script {
      env.TEST_RESULT = sh(script: "./node_modules/.bin/cypress run ", returnStatus: true)
    }
  }
}
```
Para la instalación de cypress entraremos dentro del contenedor de Jenkins:
```
docker exec -it <id_container> bash
```
Luego, dentro de él, ejecutaremos el siguiente comando:
```
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

El cuarto stage se encarga de cambiar el README en base al resultado de los tests de cypress.
```
stage('Update_Readme') {
  steps {
    script {
      env.UPDATE_RESULT = sh(script: "node ./jenkinsScripts/update_readme/index.js ${env.TEST_RESULT}", returnStatus: true)
    }
  }
}
```
Esta es la aplicación que se encarga de realizar los cambios.
```
var fs = require('fs');

var result = process.argv[2];

var regex = new RegExp(/<!---Start place for the badge -->\n(.*)\n<!---End place for the badge -->/g);
    
if (result == 0) {
    var file = fs.readFileSync("./README.md", "utf-8");

    var newstr = file.replace(regex, "<!---Start place for the badge -->\n" + "RESULTADO DE LOS ÚLTIMOS TESTS " + "[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)\n" + "<!---End place for the badge -->")

    fs.writeFileSync("./README.md", newstr);

} else if (result == 1) {
    var file = fs.readFileSync("./README.md", "utf-8");

    var newstr = file.replace(regex, "<!---Start place for the badge -->\n" + "RESULTADO DE LOS ÚLTIMOS TESTS " + "[![Cypress.io](https://img.shields.io/badge/test-failure-red)](https://www.cypress.io/)\n" + "<!---End place for the badge -->")

    fs.writeFileSync("./README.md", newstr);

}

```
<!---Start place for the badge -->
RESULTADO DE LOS ÚLTIMOS TESTS [![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
<!---End place for the badge -->


