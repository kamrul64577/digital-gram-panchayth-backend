
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  
  });
exports.login = async (req,res) => {
    try {

        const { email, password } = req.body;

        if( !email || !password){
            return res.status(400).render('login.hbs', {
                message : 'Please Provide Email & Password'
            })
        }
        db.query('SELECT * FROM admin WHERE email = ?', [email], async (error,result)=>{
            if( !result || !(await bcrypt.compare(password, result[0].password ))){
                return res.status(401).render('login.hbs', {
                    message : 'Email or Password Incorrect'
                })    
            }else{
                const id = result[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                const cookieOptions = {
                   
                    expires : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/services");
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}



exports.register = (req,res) =>{
    console.log(req.body);

    const { name,email,password,passwordConfirm } = req.body ;

   db.query('SELECT email FROM admin WHERE email = ?', [email], async (err, results) => {
        if(err){
            console.log('error ='+err);
        }if(results.length > 0 ){
            return res.render('register.hbs',{
                message: 'This email is already use'
            })
        }else if(password !== passwordConfirm){
            return res.render('register.hbs',{
                message: 'Pasword & confirm password does not match '
            });
        }

       

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO admin SET ?', {name:name, email:email, password:hashedPassword}, (error,result) => {
            if(error){
                console.log(error)
            }else{
                return res.render('register.hbs',{
                    message: 'Registered Successfully '
                });
            }
        })
   });

  

    //res.send("Form Submitted");
}








exports.services_add = (req,res) =>{
    console.log(req.body);

    const { sname, sdescription, scategories} = req.body ;
    
        db.query('INSERT INTO hospital_name SET ?', {sname:sname, scategories:scategories, sdescription:sdescription }, (error,result) => {
            if(error){
                console.log(error)
            }else{
                return res.render('hospital_add.hbs',{
                    message: 'Successfully Added the Service'
                });
            }
        })
}







exports.categories_add = (req,res) =>{
    console.log(req.body);

    const { name, h_id} = req.body ;
    
        db.query('INSERT INTO specialist SET ?', {name:name, h_id:h_id }, (error,result) => {
            if(error){
                console.log(error)
            }else{
                return res.render('categories_add.hbs',{
                    message: 'Successfully Added the Specialist'
                });
            }
        })
}


exports.doctor_add = (req,res) =>{
    console.log(req.body);

    const { name, dlocation, H_id, contact_no, qualification, S_id} = req.body ;
    
        db.query('INSERT INTO doctor SET ?', {name:name, dlocation:dlocation, H_id:H_id, contact_no:contact_no, qualification:qualification, S_id:S_id }, (error,result) => {
            if(error){
                console.log(error)
            }else{
                return res.render('doctor_add.hbs',{
                    message: 'Successfully Added the Doctors'
                });
            }
        })
}













