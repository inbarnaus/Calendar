const express = require('express')
const app = express()
// const port = 8081
let port = process.env.PORT;
const cors = require('cors');
var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.static("public"))
var {User} = require('./mongoose')
var {Event} = require('./mongoose')
var bcrypt = require('bcrypt')

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.post('/signup', (req, res) => {
  if(req.body.firstName !=='' && req.body.lastName !=='' && req.body.email !=='' && req.body.password !==''){
    const user = new User({
      fname: req.body.firstName, 
      lname: req.body.lastName, 
      email: req.body.email, 
      password: req.body.password,
      events: []
    });
    User.find({email: req.body.email}, (err, obj)=>{
      if(obj.length == 0)
        user.save(function (err) {
          if (err) 
            return console.error(err);
          res.send({succeded: true})
        });
      else
        res.send({succeded: false})
    })
  }
})

app.post('/login', (req, res) => {
  if(req.body.mail !== '' && req.body.password !== ''){
    User.find({email: req.body.email}, (err, obj)=>{
      if(obj.length != 0)
        bcrypt.compare(req.body.password, obj[0].password, (err, isMatch) => {
          if(isMatch)
            res.send({succeded: isMatch, events: obj[0].events})
          else
            res.send({succeded: isMatch})
        });
    })
  }
})

app.post('/addEvent', (req, res) => {
  var user = req.body.user
  if(user !== '' && req.body.title !== ''){
      delete req.body.user
      req.body.end = req.body.start
    User.updateOne({email: user}, { $push: { events: [req.body] } },
    function(err, result) {
      if (err)
        res.send(err);
      else 
        res.send(result);
    })
  }
})

app.set('port', process.env.PORT || port);


if (port == null || port == "") {
  port = 8081;
}
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})