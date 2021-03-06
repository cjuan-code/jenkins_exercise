# Jenkins

<!---Start place for the badge -->
RESULTADO DE LOS ÚLTIMOS TESTS [![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
<!---End place for the badge -->

Deploy en Vercel: [link](https://cjuan-jenkins-exercise.vercel.app/)

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
El cuarto stage se encarga de cambiar el README en base al resultado de los tests de cypress y se guarda el resultado del cambio.
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
Cuando los test fallen la etiqueta del README se ve de la siguiente forma:
![push_changes_fail](https://user-images.githubusercontent.com/79716922/152015947-e55b8dc2-3e45-49db-bdd3-d23f24249342.png)
Y en caso de que los tests funcionen correctamente, se ve así:
![push_changes_success](https://user-images.githubusercontent.com/79716922/152016037-62ba0b06-23a2-4625-927d-b22b27701783.png)

El quinto stage se encarga de subir los cambios al repositorio.
```
stage('Push_Changes') {
  steps {
    sh "chmod +x ./jenkinsScripts/push_changes/push_changes.sh"
    sh "./jenkinsScripts/push_changes/push_changes.sh ${params.ejecutor} ${params.motivo} ${REPO_URL}"
  }
}
```
Este es el script que se ejecuta:
```
git config --global user.name "cjuan-code"
git config --global user.email "cjuaniestacio@gmail.com"
git remote set-url origin $3

git add .
git commit -m "Pipeline ejecutada por $1. Motivo: $2"
git push origin HEAD:master
```
El sexto y penúltimo stage se encarga de realizar el deploy en Vercel.
```
stage('Deploy_to_Vercel') {
  steps {
    sh "chmod +x ./jenkinsScripts/vercel_deploy/vercel_deploy.sh"
    script {
      env.DEPLOY_RESULT = sh(script: "./jenkinsScripts/vercel_deploy/vercel_deploy.sh ${VERCEL_TOKEN} ${env.LINTER_RESULT} ${env.TEST_RESULT} ${env.UPDATE_RESULT}", returnStatus: true)
    }
  }
}
```

Para la instalación del CLI de vercel, entraremos de nuevo al contenedor de Jenkins y ejecutaremos el siguiente comando:
```
npm install -g vercel
```

Para poder realizar el despliegue hemos de generar un token en vercel.
![vercel_token](https://user-images.githubusercontent.com/79716922/152017045-efafa206-bc79-4af3-bda3-ac323a1eb7a5.png)
Y crear la credencial en Jenkins.
![vercel_token_jenkins_credential](https://user-images.githubusercontent.com/79716922/152017120-66b6dd70-3a42-4926-ac64-d46d23ecd033.png)

El script que se ejecuta es el siguiente, se encarga de mirar si todas los stages anteriores se han ejecutado de forma correcta, en caso de que así sea, se realiza el despliegue.
```
if [ $2 -eq 0 ] && [ $3 -eq 0 ] && [ $4 -eq 0 ]; then
    vercel . --token $1 --confirm --name cjuan-jenkins-exercise
    exit 0
else
    exit 1
fi
```

El último stage se encarga de enviar un correo al destinatario que introducido en el parámetro de entrada con los resultados de las stages de la pipeline.
```
stage('Notificacion') {
  steps {
    sh "node ./jenkinsScripts/notificacion/index.js ${GOOGLE_PASSWORD} ${params.correo_notify} ${env.LINTER_RESULT} ${env.TEST_RESULT} ${env.UPDATE_RESULT} ${env.DEPLOY_RESULT}"
  }
}
```
Esta es la aplicación que se encarga de ello:
```
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  let lint_result = process.argv[4] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  let test_result = process.argv[5] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  let update_result = process.argv[6] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  let deploy_result = process.argv[7] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "cjuaniestacio@gmail.com", // generated ethereal user
      pass: process.argv[2], // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'cjuaniestacio@gmail.com', // sender address
    to: process.argv[3], // list of receivers
    subject: "Resultado de la pipeline ejecutada", // Subject line
    text: "Se ha realizado un push en la rama main que ha provocado la ejecución de la pipeline con los siguientes resultados: \n - Linter_stage: " + lint_result + "\n" + "- Test_stage: " + test_result + "\n" + "- Update_readme_stage: " + update_result + "\n" + "- Deploy_to_Vercel_stage: " + deploy_result + "\n", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
```
Una vez ejecutada la pipeline, al acceder al correo indicado como parámetro, podremos ver el email con los resultados de todos los stages.
![mail_result](https://user-images.githubusercontent.com/79716922/152018448-d9f6f4d9-f54c-49a2-8a0d-a4f9b1ae7349.png)

### Instalación y configuración del plugin Dashboard View
Para la intalación iremos al apartado de plugins y lo buscamos.
![install_dashboard_view](https://user-images.githubusercontent.com/79716922/152019134-05daf789-dd68-4c2a-9356-497912f2792d.png)
Una vez instalado, en el Menú principal de Jenkins, crearemos una nueva vista de tipo Dashboard.
![new_view](https://user-images.githubusercontent.com/79716922/152019674-616f8c1c-8aab-4831-9249-a99fd684a153.png)
Ahora la configuramos.
![config](https://user-images.githubusercontent.com/79716922/152019734-b6dde4b9-f689-4246-b55c-c766ff370363.png)
![config_2](https://user-images.githubusercontent.com/79716922/152019743-88c22a8c-6aa3-45eb-8411-9be4c4616d2a.png)
![config_3](https://user-images.githubusercontent.com/79716922/152019752-842a9e5d-e942-43fc-b559-20e5cfcbc453.png)
Y una vez configurada a nuestro gusto, accedemos a ella. En mi caso, se ve de la siguiente forma:
![dashboard_view](https://user-images.githubusercontent.com/79716922/152019761-aaa3cf82-1c1d-4b3c-bc87-d0431b0f9533.png)
