// Backend: application services, accessible by URIs


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from "url";
import DbService from './dbService.js';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = DbService.getDbServiceInstance();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use("/static", express.static(path.join(__dirname, "..", "Frontend", "static")));
app.use("/views", express.static(path.join(__dirname, "..", "Frontend", "views")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "index.html"));
});

// function to call when needing to verify email format
function isValidEmail(email) {
    // simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// post request for server to assist in logging into a valid account
app.post('/login', async (req, res) => {
    const { user, password } = req.body;

    try {
        // const db = DbService.getDbServiceInstance();
        const userRecord = await db.findUser(user);

        if (!userRecord) {
            return res.status(400).json({ success: false, error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userRecord.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid password" });
        }

        await db.updateLastLoginDate(userRecord.id);

        // success
        return res.json({ success: true, message: "Login successful", username: userRecord.username });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});

// this is a post request which sends the data from the registration page
// to the database in order to create a new unique user
app.post('/register', async (request, response) => {

    console.log('app: register user') // verifies the request was sent

    try {
        // parses the JSON recieved from the frontend
        let {firstName, lastName, age, salary, user, password, confirm} = request.body;

        firstName = firstName.toLowerCase().trim();
        lastName = lastName.toLowerCase().trim();
        user = user.toLowerCase().trim();

        // checks that all fields contain values
        if (!firstName || !lastName || !user || !password || !confirm || !age || !salary) {
                return response.status(400).json({ error: 'All fields are required' });
            }

        // verifies if the password and confirm field match
        if (password !== confirm) return response.status(400).json({error: "Passwords do not match"});

        const userTaken = await db.userExists(user); // calls userExists from dbService

        // checks if user in field already exists in database and returns error if true
        if (userTaken) return response.status(400).json({error: 'user already registered'})
        
        // we decided to not add a minimum password length or require specific characters
        // but we are hashing password here
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // passes the values from the json into the newRegistration function from
        // our database service file to submit it to the database
        const registered = await db.newRegistration(firstName, lastName, age, salary, user, hashPassword);

        response.status(201).json({data: registered})

    } catch (error) {
        console.error('Registration Error: ' + error);
        response.status(500).json({error: "Registration Error"});
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

// create
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


app.get('/search/:first_name', (request, response) => { // we can debug by URL
    
    const {first_name} = request.params;
    
    console.log(first_name);

    // const db = dbService.getDbServiceInstance();

    let result;
    if(first_name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByFirstName(first_name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/:last_name', (request, response) => { // we can debug by URL
    
    const {last_name} = request.params;
    
    console.log(last_name);

    // const db = dbService.getDbServiceInstance();

    let result;
    if(last_name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByLastName(last_name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// configures node js application on port in .env
// set up web server listener
// works whether or not we use .env to configure on port 5050
app.listen(process.env.PORT || 5050, 
    () => {
        console.log(`Server running on http://localhost:${process.env.PORT}/`)
    }
);


