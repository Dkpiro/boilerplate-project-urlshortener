require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')
const urlExists = require('url-exists')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', express.static(`${process.cwd()}/public`));

let links = []
let shortUrl = 0

app.post('/api/shorturl', function(req, res){
  shortUrl += 1
  links.push(req.body.url, shortUrl)
  console.log(req.body.url)
  urlExists(req.body.url, function(err, exists){
    if (exists){
       res.send({original_url: req.body.url, short_url: shortUrl})
    } else {
      res.send({error: "invalid url"})
    }
  })
})


app.get('/api/shorturl/:num', function(req, res){
  if (links.indexOf(Number(req.params.num)) !== -1){
    res.redirect(links[links.indexOf(Number(req.params.num)) - 1])
  }
})

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
