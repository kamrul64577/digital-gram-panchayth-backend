const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/middlewareAuth');

dotenv.config( { path: './.env' } )

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE

});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());



app.set('viewengine', 'hbs');

db.connect((error) =>{
  if(error){
    console.log('error connecting: ' + error);
    
  }else{
    console.log("Database connected..");
  }
});

app.get('/login', (req,res) => res.render('login.hbs'))
app.get('/register', (req,res) => res.render('register.hbs'))


app.get('/services_add', requireAuth,(req,res) => res.render('services_add.hbs'))
// app.get('/categories_add', requireAuth,(req,res) => res.render('categories_add.hbs'))



/*===================================================================
         Service SECTION
===================================================================== */

  app.get('/services', requireAuth,function(req,res){
    db.query('SELECT * FROM services', function(err, row) {
      if(err){
          console.log(err)
      }
      else{
        // console.log(row)
        res.render('services.hbs', {title: "service Name", hos:row})
          
      }
  })
  });

  app.get('/requestservice', requireAuth,function(req,res){
    db.query('SELECT * FROM requestedservices', function(err, row) {
      if(err){
          console.log(err)
      }
      else{
        // console.log(row)
        res.render('requestService.hbs', {title: "request service Name", requestedService:row})
          
      }
  })
  });

  app.get('/repairrequest', requireAuth,function(req,res){
    db.query('SELECT * FROM repair', function(err, row) {
      if(err){
          console.log(err)
      }
      else{
        // console.log(row)
        res.render('repairRequest.hbs', {title: "request service Name", repairRequest:row})
          
      }
  })
  });



  app.get('/edit-services-form/:s_id', function(req, res, next) {
    var s_id = req.params.s_id;
    db.query(`SELECT * FROM services WHERE s_id=${s_id}`, function(err, row) {
        console.log(row[0]);
        res.render('editServices.hbs', {hos: row[0]});
    });
  });


  app.post('/edit/:s_id', function(req, res, next) {
    var sname = req.body.sname;
    var sdescription = req.body.sdescription;
    var scategories = req.body.scategories;
    var s_id = req.params.s_id;
    
   
  
    db.query(`UPDATE services SET sname="${sname}", scategories="${scategories}", sdescription="${sdescription}" WHERE s_id=${s_id}`, function(err, row) {
    
      if(err){
        console.log(err)
    }
    else{
      //console.log(row)
      res.redirect('/services')
        
    }
    });
  });

  app.get('/delete-services/:s_id', function(req, res){
    var s_id = req.params.s_id;
    console.log(s_id);
    var sql = `DELETE FROM services WHERE s_id=${s_id}`;
  
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record deleted!');
      res.redirect('/services');
    });
  });

app.get('/delete-request-service/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  
  var sql = `DELETE FROM requestedservices WHERE id=${id}`;

  db.query(sql, function (err, result) {
    if (err) throw err;
    
    console.log('record deleted!');
    res.redirect('/requestservice');
  });
});

app.get('/delete-request-repair/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  
  var sql = `DELETE FROM repair WHERE id=${id}`;

  db.query(sql, function (err, result) {
    if (err) throw err;
    
    console.log('record deleted!');
    res.redirect('/repairrequest');
  });
});



 

//app.use('/', ('./routes/pages.js'))
app.use('/auth', require('./routes/auth'))






/* ======================================================
   PASS & SHOW DATA IN FRONT END PART
=======================================================*/

const cors = require('cors');

const { categories } = require('./controllers/auth');
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))



app.post("/api/insertService", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const contact = req.body.contact;
  const type = req.body.type;
  const whyNeed = req.body.whyNeed;

  const sqlInsertService = "INSERT INTO requestedservices (name, email, contact, type, whyNeed) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlInsertService, [name, email, contact, type, whyNeed], (err, result) => {
    console.log(err);
    console.log('wow')
  })
})


app.post("/api/insertRepair", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const contact = req.body.contact;
  const requestFor = req.body.requestFor;
  const description = req.body.description;

  const sqlInsertRepair = "INSERT INTO repair (name, email, contact, requestFor, description) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlInsertRepair, [name, email, contact, requestFor, description], (err, result) => {
    console.log(err);
    console.log('wow')
  })
})




app.get("/getServices", (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      //console.log('hi')
      res.send(result);
    }
  });
});




app.listen(3001,()=> console.log("listening port 3001"));