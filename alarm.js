
const express = require('express')
const fs = require('fs');
const os = require("os");
const readLastLines = require('read-last-lines');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/error', async (req, res) => {
  await logError({ someproperty: 'error property'});
  await checkErrors();
  res.send('Error logged');  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

async function logError(error) {
    const now = new Date();
    fs.appendFile("/tmp/test", `${error.someproperty},${now}${os.EOL}`, function(err) {
        console.log("The error was saved!");
    }); 
}

async function checkErrors() {
    console.log('hi');
    const errors = await readLastLines.read('/tmp/test', 10).then((lines) => lines.split('\n'));
    if (errors.length == 11) { // we have ten items since there's an empty line added
        const firstError = errors[0];
        const lastError = errors[9];
        var diff =(firstError.getTime() - lastError.getTime()) / 1000;
        diff /= 60;
        var diffMins = Math.abs(Math.round(diff));
        console.log('hi', diffMins);
    }
}