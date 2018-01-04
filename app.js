const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/shorturl/new', (req, res) => {
  console.log(req.body.value);
  res.json({
    dennis: 'dennis'
  });
});

app.listen(port, () => {
  console.log('Node is listening on port 8080');
});
