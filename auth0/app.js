const express = require("express");

const bcrypt = require('bcrypt');

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors'); 

require('dotenv').config('.env');


const {User, Item} = require('./models');

// initialise Express
const app = express();

app.use(cors());

// specify out request bodies are json
app.use(express.json());


const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}`,
  algorithms: ['RS256']
  });
  

//app.use(jwtCheck);



app.get('/', (req, res) => {
  res.send('<h1>Hello!!!!</h1>')
})

app.get('/users', jwtCheck, async (req, res) => {
  //what should i put here?
  let users = await User.findAll()
  res.json({users});
})

app.get('/users/:id', async (req, res) => {
  let user = await User.findByPk(req.params.id);
  res.json({user});
})

// I want to get all items

app.get('/items',jwtCheck, async(req, res)=> {
  let items = await Item.findAll();
  res.json({items});
})

// I want to get one item

app.get('/items/:id', async(req, res)=> {
  let item = await Item.findByPk(req.params.id);
  res.json({item});
})

// I want to delete one item

app.delete('/items/:id', async(req, res)=> {
  await Item.destroy({where: {id: req.params.id}});
  res.send('Deleted!')
})

// I want to create one item

app.post('/users', async(req, res)=> {
  const {name,password} = req.body;
  const hashPassword = await bcrypt.hash(password, 2)
   await User.create({name, password:hashPassword});
  res.status(201).send("Created!")
})

// I want to update one item

app.put('/users/:id', async(req, res)=> {
  let updatedUser = await User.update(req.body, {
    where : {id : req.params.id}
  });
  res.json({updatedUser})
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});