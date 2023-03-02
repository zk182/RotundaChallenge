
const express = require('express')
const fs = require('fs');
const os = require("os");
const readLastLines = require('read-last-lines');
const app = express()
const port = 3000

const maxPossibleErrors = 10
let shouldNotify = true;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.post('/error', async (req, res) => {
  await logError({ someproperty: 'error property'});
  console.log('should notify is', shouldNotify);
  if (shouldNotify) { 
    await checkErrors();
  }
  res.send('Error logged');  
})


async function logError(error) {
    const now = new Date();
    fs.appendFile("/tmp/test", `${error.someproperty},${now}${os.EOL}`, function(err) {
        if (!err) console.log("The error was saved!");
    }); 
}

async function checkErrors() {
    const errors = await readLastLines.read('/tmp/test', 10).then((lines) => lines.split('\n')); // we just read last ten items
    if (errors.length == maxPossibleErrors + 1) { // we have ten items + one empty line
        const first = new Date(errors[0]);
        const last = new Date(errors[9]);
        const seconds = Math.abs(first.getTime() - last.getTime()) / 1000;
        console.log(`difference in seconds is ${seconds}, ${first.getTime()}, ${last.getTime()}`);
        if (seconds <= 60) {
          resetNotifier();
          console.log('email sent!');
        }
    }
}

async function resetNotifier() {
  shouldNotify = false;
  setTimeout(()=> { shouldNotify = true; console.log('hi time has passed!!')}, 60000);
}