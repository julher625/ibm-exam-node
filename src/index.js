const express = require('express')
const indexRoutes = require('./routes/index');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());

app.set('port',8000)

app.use(cors());

app.use(indexRoutes)


app.listen(app.get('port'), ()=>{
    console.log(`App running in localhost:${app.get('port')}`)
}
)
