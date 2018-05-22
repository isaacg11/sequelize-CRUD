// module imports
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const Sequelize = require('sequelize');
const app = express();
const router = express.Router();
const handlebars = require("express-handlebars").create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// body parser config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// connect to db
const sequelize = new Sequelize('mydb', 'YOUR_NAME', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Chinook_Sqlite_AutoIncrementPKs.sqlite'
});

// define schema
const Car = sequelize.define('Car', {
    CarId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Type: Sequelize.STRING,
    Year: Sequelize.STRING
},
{
    freezeTableName: true,
    timestamps: false
})

// create a Car table if none exists in DB
Car.sync();

// CREATE
app.post('/create/car', (req, res) => {
    Car.create({
        Type: req.body.type,
        Year: req.body.year
      });
      res.sendStatus(200)
})

// READ
app.get('/', (req, res) => {
    Car.findAll().then(cars => {
        res.render('home', {
            vehicles: cars
        })
    })
})

// UPDATE
app.post('/update/car', (req, res) => {
    Car.update(
        {
          Type: req.body.type,
          Year: req.body.year
        },
        { 
            where: {
                CarId: req.body.id
            }
        }
    ).then(result => {
        res.sendStatus(200)     
  });
});

// DELETE
app.post('/delete/car', (req, res) => {
    Car.find({ 
      where: { CarId: req.body.id }
      }).then(car => {
        car.destroy();
        res.sendStatus(200);
      });
});

// run server on port 3000
app.listen(3000, () => {
    console.log('server running')
})
