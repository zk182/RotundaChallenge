alarm.js is a prototype in pseudo code of the solution for the alarm problem

We defined an entry endpoint (POST /operation) which calls coolOperation.
coolOperation is the function responsible for doing normal operations that we need to catch, 
but in our code, this just returns an error simulating something going wrong in our
business logic.

Our endpoint then:
a) logs the error by calling logError()
b) checks status of shouldNotify, which ensures that at least 60 seconds passed since last email notification
c) calls hasErrorOverflow() in case shouldNotify is enabled
d) calls notify() which finally sends the email notification, in case errorOverflow is true

hasErrorOverflow then reads last 10 error lines 
(another solution could be to standarize every error information to N bytes each, and then reading last N x 10 bytes of the file)
which returns true/false based on how much errors happened during last 60 seconds

In case less than 60 seconds passed in the ten error period, we call notify() which:
a) sets shouldNotify to false
b) puts a timeout on shouldNotify to reset it after 60 seconds
c) sends the email (in pseudocode, line 60)


In case other operations needs to be aware of this as well, 
email handling should be defined in an error middleware.
Every operation that needs to send an email should call
next(err), where the error middleware should be defined as

function emailHandler(err, req, res, next) {
    await logError(err);
    if (shouldNotify) { 
      await checkErrors();
    }
    res.send('Error logged');  
}

and should be defined as the last middleware in the chain

app.use(someMiddleware);
app.use(someOtherMiddleware);
app.use(emailHandler);



To test this, `npm start`, then hit `POST http://localhost:3000/operation` ten times and
you should see a test file in `tmp/test` folder with each error inside.