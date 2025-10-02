// Backend: application services, accessible by URIs


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DbService from './dbService.js';
dotenv.config()

const app = express();
const db = DbService.getDbServiceInstance();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// function to call when needing to verify email format
function isValidEmail(email) {
    // simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// create
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {name} = request.body;
    // const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});

// this is a post request which sends the data from the registration page
// to the database in order to create a new unique user
app.post('/register', async (request, response) => {

    console.log('app: register user') // verifies the request was sent

    try {
        // parses the JSON recieved from the frontend
        const {firstName, lastName, age, salary, email, password, confirm} = request.body;

        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();
        email = email.toLowerCase();

        // checks that all fields contain values
        if (!firstName || !lastName || !email || !password || !confirm || !age || !salary) {
                return response.status(400).json({ error: 'All fields are required' });
            }

        // verifies if the password and confirm field match
        if (password !== confirm) return response.status(400).json({error: "Passwords do not match"});

        // calls isValidEmail to verify proper email format
        if (!isValidEmail(email)) return response.status(400).json({error: 'Invalid email format'});

        const emailTaken = await db.emailExists(email); // calls emailExists from dbService

        // checks if email in field already exists in database and returns error if true
        if (emailTaken) return response.status(400).json({error: 'Email already registered'})
        
        // we decided to not add a minimum password length or require specific characters

        // passes the values from the json into the newRegistration function from
        // our database service file to submit it to the database
        const registered = await db.newRegistration(firstName, lastName, email, password);

        response.status(201).json({data: registered})

    } catch (error) {
        console.error('Registration Error: error');
        response.status(500).json({error: "Server Error"});
    }
});

// this is without try-catch easier to write
// app.post('/register', (request, response) => { 
//     console.log('app: register user') // verifies the request was sent 

//     // parses the JSON recieved from the frontend 
//     const {firstName, lastName, email, password, confirm} = request.body; 

//     // verifies all fields contain values
//     if (!firstName || !lastName || !email || !password || !confirm) {
//             return response.status(400).json({ error: 'All fields are required' });
//         }

//     // verifies if the password and confirm field match 
//     if (password !== confirm) { 
//         return response.status(400).json({error: "Passwords do not match"}); } 
        
//     // passes the values from the json into the newRegistration function from 
//     // our database service file to submit it to the database 
//     const result = db.newRegistration(firstName, lastName, email, password); 
//     result.then(data => response.json({data: data})) 
//     .catch(err => console.log(err)); 

// });


// read 
app.get('/getAll', (request, response) => {
    
    // const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    // const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
        //   const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        // const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    // const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);
