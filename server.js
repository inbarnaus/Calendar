const express = require('express')
const app = express()
const port = 8080
const cors = require('cors');
var bodyParser = require('body-parser')
app.use(express.json());
var User = require('./mongoose')

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
 
app.get('/', (req, res) => {
  console.log('inbar');
})

app.post('/signup', (req, res) => {
  if(req.body.firstName !=='' && req.body.lastName !=='' && req.body.email !=='' && req.body.password !==''){
    const user = new User({
      fname: req.body.firstName, 
      lname: req.body.lastName, 
      email: req.body.email, 
      password: req.body.password
    });

    User.find({email: req.body.email}, (err, obj)=>{
      if(obj.length == 0)
        user.save(function (err) {
            if (err) return console.error(err);
              res.send({succeded: true})
            });
            else{
              res.send({succeded: false})
            }
    })
  }
})

app.post('/login', (req, res) => {
  if(req.body.mail != '')
    console.log(req.body);
})

app.set('port', process.env.PORT || port);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})