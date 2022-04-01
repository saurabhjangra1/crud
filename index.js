const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyparser.json());

// database connection

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simpledb',
    port: 3306
});

// check database connection

db.connect(err=>{
    if(err){
        console.log(err, "db-err");
    }
    console.log("database connected");
});


// get all users

app.get('/user', (req,res)=>{

    let qr = 'select * from user';
    db.query(qr, (err, result)=>{
        if(err){
            console.log(err, "err")
        }
        if(result.length>0){
            res.send({
                message: "all user data",
                data: result
            })
        }
    });
});

// get user by email 

app.get('/user/:email', (req, res)=>{

    let gEmail = req.params.email;
    let qr = `select * from user where email = '${gEmail}'`;
    console.log("qr", qr);

    db.query(qr, (err, result)=>{

        if(err){
            console.log(err);
        }
        if(result.length > 0){
            res.send({
                message: 'get user by email',
                data: result
            });
        }
        else{
            res.send({
                message: 'user not found'
            });
        }
    });
});



// create/post data

app.post('/user', (req, res)=>{
    
    console.log(req.body, 'createdata');

    let fullName = req.body.fullname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let password = req.body.password;

    let qr = `insert into user(fullname, email, mobile, password) 
                values('${fullName}','${email}', '${mobile}', '${password}')`;

    console.log(qr, 'qr');
    
    db.query(qr, (err, result) =>{
        if(err){
            console.log(err);
        }
        console.log(result, 'result');
        res.send({
            message: 'data inserted',
        });
    });
});



// update user

app.put('/user/:id', (req, res)=>{

    console.log(req.body, 'updateData');

    let gID = req.params.id;
    let fullname = req.body.fullname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let password = req.body.password;

    let qr = `update user set fullname = '${fullname}', email = '${email}', mobile = '${mobile}', password = '${password}'
              where id = ${gID}`;

    db.query(qr, (err, result)=>{

        if(err){
            console.log(err);
        }
        res.send({
            message: "data updated"
        });
    });
});



// delete user

app.delete('/user/:id', (req, res)=>{

    let gID = req.params.id;
    let qr = `delete from user where id = ${gID}`;

    db.query(qr, (err, result)=>{
        if(err){
            console.log(err);
        }

        res.send({
            message: "data deleted"
        })
    });
});


// listen to the port

app.listen(3000, ()=>{
    console.log("server running..");
});