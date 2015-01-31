/* dependencies */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

var logger = require('morgan');

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

/* Tell express view engine to use jade */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));

/* Tell express to serve static files from the public folder. */
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
});

/* Listen on port 3000 */
app.listen(process.env.PORT || 3000)