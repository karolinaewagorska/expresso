const bodyParser = require('body-parser');
const cors = require('cors');
const errrorHabdler = require('errorhandler');
const morgan = require('morgan');
const express = require('express');
const apiRouter = require('./api/api');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(errrorHabdler());

app.use(cors());
app.use(morgan);


app.use('/api', apiRouter)

app.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT);
});

module.exports = app;