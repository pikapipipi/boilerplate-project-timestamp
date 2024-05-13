// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'Hello World, hello API' });
});


// API endpoint for timestamp
/*result in JSON format
1. Unix timestamp in milliseconds, as type Number 
2. UTC key in the format: Thu, 01 Jan 1970 00:00:00 GMT, as a string*/
app.get("/api/:date?", (req, res) => {
  //reset result
  let result = {
    "unix": "error",
    "utc": "Invalid Date"
  };

  let input = req.params.date;
  console.log("input: " + input);


  if (input == "" || input == null) {
    //if input is empty, return current date
    console.log("input is empty");

    input = new Date();
    result.unix = input.valueOf();
    result.utc = input.toUTCString();

  } else if (isNumeric(input)) {
    //Check if input is a valid date in Numberic format
    console.log("input is numeric");

    const seconds = Math.trunc(input / 1000);  // Extract seconds
    const milliseconds = input % 1000;        // Extract milliseconds

    result.unix = new Date(seconds * 1000 + milliseconds).getTime();
    result.utc = new Date(seconds * 1000 + milliseconds).toUTCString();
    //Not using new Date(input).toUTCString() because the Date constructor might misinterpret large integer as milliseconds outside the valid range for dates. This can return to unexpected "Invalid Date".

  } else if (isValidTimestamp(input)) {
    //Check if input is a valid date in String format
    console.log("input is valid date string");

    input = new Date(input);
    result.unix = input.valueOf();
    result.utc = input.toUTCString();

  } else {
    result = {
      "error": "Invalid Date"
    };
  }

  console.log("result: " + JSON.stringify(result));
  return res.json(result);
});

//Helper function to check if a date is valid
//https://stackoverflow.com/questions/12422918/how-to-validate-timestamp-in-javascript
function isValidTimestamp(_timestamp) {
  const newTimestamp = new Date(_timestamp).getTime();
  return isNumeric(newTimestamp);
};
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
