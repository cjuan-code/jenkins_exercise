var fs = require('fs');

var result = process.argv[2];

console.log('result', result)

var regex = new RegExp(/<!---Start place for the badge -->\n(.*)\n<!---End place for the badge -->/g);
    
if (result == "success") {
    var file = fs.readFileSync("../../README.md", "utf-8");

    // var newstr = file.replace(regex, "<!---Start place for the badge -->\n" + "RESULTADO DE LOS ÚLTIMOS TESTS " + "[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)\n" + "<!---End place for the badge -->")

    // fs.writeFileSync("./README.md", newstr);

    console.log('success', file)

} else if (result == "failure") {
    var file = fs.readFileSync("../../README.md", "utf-8");

    // var newstr = file.replace(regex, "<!---Start place for the badge -->\n" + "RESULTADO DE LOS ÚLTIMOS TESTS " + "[![Cypress.io](https://img.shields.io/badge/test-failure-red)](https://www.cypress.io/)\n" + "<!---End place for the badge -->")

    // fs.writeFileSync("./README.md", newstr);

    console.log('fail', file)

}