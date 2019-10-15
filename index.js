require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('debug', true);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes');
const handle = require('./handlers');
const path = require('path')

const app = express();
const db = require('./config/keys').monogoURI
mongoose.Promise = global.Promise;
//const MONGODB_URI = "mongodb://root:root123@ds015869.mlab.com:15869/pollapp"


mongoose
.connect(db, { useNewUrlParser: true })
.then(()=> console.log('mongodb connected'))
.catch (err => console.log(err));

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', routes.auth);
app.use('/api/polls', routes.poll);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(handle.error);

app.get("*", (req, res) => {
     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});




app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
