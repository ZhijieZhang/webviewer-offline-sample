const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const opn = require('opn');
const ip = require('ip');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('src'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/serviceWorker.js', (req, res) => {
  res.sendFile(path.join(__dirname, './serviceWorker.js'));
})

app.listen(3000, '0.0.0.0', (err) => {
	if (err) {
		console.error(err);
	} else {
		console.info(`Listening at localhost:3000 (http://${ip.address()}:3000)`);
    opn(`http://localhost:3000/`);
	}
});