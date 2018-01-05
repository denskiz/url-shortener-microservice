const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
const shortUrl = require('./models/model');

mongoose.connect(
  'mongodb://dennis:dennis@ds237717.mlab.com:37717/fcc-url-shortener-micoservice'
);
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
  if (validUrl.isUri(req.body.url)) {
    var short = Math.floor(Math.random() * 100000000).toString();

    var data = new shortUrl({
      originalUrl: req.body.url,
      shorterUrl: short
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

app.get('/:urlToForward', (req, res) => {
  var shorterUrl = req.params.urlToForward;

  shortUrl.findOne({ shorterUrl }, (err, data) => {
    if (err) return res.send('Error reading database');
    var re = new RegExp('^(http|https)://', 'i');
    var strToCheck = data.originalUrl;
    if (re.test(strToCheck)) {
      res.redirect(301, data.originalUrl);
    } else {
      res.redirect(301, `http://${data.originalUrl}`);
    }
  });
});

app.listen(port, () => {
  console.log('Node is listening on port 8080');
});
