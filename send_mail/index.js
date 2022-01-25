function toParams(data_js) {
    var form_data = [];
    for ( var key in data_js ) {
        form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
    }

    return form_data.join("&");
}

var XMLHttpRequest = require('xhr2');
var core = require('@actions/core');

var data_js = {
    "access_token": core.getInput("postmail_secret")
};

var request = new XMLHttpRequest();

data_js['subject'] = 'Resultado del workflow ejecutado';
data_js['text'] = "Se ha realizado un push en la rama main que ha provocado la ejecución del workflow githubActions_exercise_workflow con los siguientes resultados:\n- linter_job:" + core.getInput("linter_result") + "\n- cypress_job: " + core.getInput("cypress_result") + "\n- add_badge_job: " + core.getInput("add_badge_result") + "\n- deploy_job: " + core.getInput("deploy_result");

var params = toParams(data_js);

request.open("POST", "https://postmail.invotes.com/send", true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

request.send(params);