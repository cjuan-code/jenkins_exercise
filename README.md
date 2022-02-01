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



<!---Start place for the badge -->
RESULTADO DE LOS ÚLTIMOS TESTS [![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
<!---End place for the badge -->
