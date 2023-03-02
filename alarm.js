
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

app.post('/operation', async (req, res) => {
  try { 
    coolOperation()
  } catch (err) {
    await logError(err);
    if (shouldNotify) { 
      const errorOverflow = await hasErrorOverflow();
      if (errorOverflow) await notify();
    }
  } finally {
    res.send('Error logged');  
  }
})

// This is the function responsible for doing normal operations that we need to catch
function coolOperation() {
  throw new Error({ someproperty: 'this is an error property'})
}

// This is the logger function responsible for appending errors
async function logError(error) {
    fs.appendFile("/tmp/test", `${error.someproperty},${new Date()}${os.EOL}`, function(err) {
        if (!err) console.log("The error was saved!");
    }); 
}

async function hasErrorOverflow() {
    const errors = await readLastLines.read('/tmp/test', 10).then((lines) => lines.split('\n')); // we just read only last ten items, not the whole file
    if (errors.length == maxPossibleErrors + 1) { // we have ten items + one empty line
        const first = new Date(errors[0]);
        const last = new Date(errors[9]);
        const seconds = Math.abs(first.getTime() - last.getTime()) / 1000;
        console.log(`difference in seconds is ${seconds}`);
        return seconds <= 60; // the ten error items must have passed in the last minute
    }
    return false;
}


async function notify() {
  resetNotifier();        
  // here we should send an email, but since this is pseudo code we 
  // can think of next line as an email sender

  // sendEmail(user);
  console.log('email sent!');
}

async function resetNotifier() {
  shouldNotify = false;
  console.log('shouldNotify is now disabled');
  setTimeout(()=> { shouldNotify = true; console.log('shouldNotify is now enabled')}, 60000);
}