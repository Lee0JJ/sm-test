const express = require("express")
const path = require('path')

const app = express();

app.use('/css', express.static(path.join(__dirname, 'views/assets/css')))
app.use('/js', express.static(path.join(__dirname, 'views/assets/js')))
app.use('/img', express.static(path.join(__dirname, 'views/assets/img')))
app.use('/components', express.static(path.join(__dirname, 'views/components')))

app.use('/css/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/css/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')))
app.use('/js/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/js/popper', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/components/destinationCard.html'))
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.get("/destination/:country", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/destination.html'))
});

app.get("/tour/:id", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/tour.html'))
});

app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});