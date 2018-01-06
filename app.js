const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
const shortUrl = require('./models/model');

mongoose.connect(process.env.MONGODB_URI);

mongoose.Promise = global.Promise;
//process.env.MONGODB_URI
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/shorturl/new', (req, res) => {
  // Check to see if URL is valid:
  if (validUrl.isUri(req.body.url)) {
    var data = new shortUrl({
      originalUrl: req.body.url,
      shorterUrl: 3
    });

    data.save(err => {
      if (err) {
        res.send('Error saving to database');
      }
    });

    return res.json({
      data
    });
  } else {
    res.json({ error: 'invalid URL' });
  }
});

app.get('/api/shorturl/3', (req, res) => {
  // shortUrl.findOne({ shorterUrl: 3 }, (err, data) => {
  //   if (err) return res.send('Error reading database');

  res.redirect('https://www.freecodecamp.com');
  // });
});

app.listen(port, () => {
  console.log('Node is listening on port 8080');
});
