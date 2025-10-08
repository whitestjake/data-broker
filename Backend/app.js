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

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "views","register.html"))
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "views","login.html"))
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "views","home.html"))
});


// post request for server to assist in logging into a valid account
app.post('/login', async (req, res) => {
    const { user, password } = req.body;

    try {
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
        return res.json({ success: true, message: "Login successful", firstName: userRecord.first_name, username: userRecord.username });

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

        response.status(201).json({ data: { username: user, firstName: registered.firstName } });

    } catch (error) {
        console.error('Registration Error: ' + error);
        response.status(500).json({error: "Registration Error"});
    }
});

app.get('/accounts', async (req, res) => {
    try {
        const data = await db.getAccountData();
        // console.log(data)
        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
});

app.get('/get-current-user', (req, res) => {
    // You can store current user info in session or a temporary global store
    // For example, here using a placeholder
    const currentUser = req.query.username ? users.find(u => u.username === req.query.username) : null;
    if (currentUser) {
        res.json({ first_name: currentUser.first_name, username: currentUser.username });
    } else {
        res.json({ username: 'Guest' });
    }
});

// create
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);

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
    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:first_name', (request, response) => { // we can debug by URL
    
    const {first_name} = request.params;
    
    console.log(first_name);

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

    let result;
    if(last_name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByLastName(last_name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// Search by ID
app.get('/search/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await db.searchById(id);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Search by full name
app.get('/search/fullname', async (req, res) => {
    const { first_name, last_name } = req.query;
    try {
        const data = await db.searchByFullName(first_name, last_name);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Search by first name
app.get('/search/first/:first_name', async (req, res) => {
    const { first_name } = req.params;
    try {
        const data = await db.searchByFirstName(first_name);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Search by last name
app.get('/search/last/:last_name', async (req, res) => {
    const { last_name } = req.params;
    try {
        const data = await db.searchByLastName(last_name);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Search by username
app.get('/search/username/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const data = await db.searchByUsername(username);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Search by salary range
app.get('/search/salary', async (req, res) => {
    const { min, max } = req.query;
    try {
        const data = await db.searchBySalary(min, max);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Search by age range
app.get('/search/age', async (req, res) => {
    const { min, max } = req.query;
    try {
        const data = await db.searchByAge(min, max);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Unified search endpoint
app.get('/search', async (req, res) => {
    try {
        const { id, username, first_name, last_name, age, salary, lastLogin, regFilterType, regFilterUser } = req.query;

        // Start fresh each time
        let results = await db.getAccountData();
        
        // --- Basic filters ---
        if (id) results = results.filter(u => String(u.id) === String(id));
        if (username) results = results.filter(u => u.username.toLowerCase().includes(username.toLowerCase()));
        if (first_name) results = results.filter(u => u.first_name.toLowerCase().includes(first_name.toLowerCase()));
        if (last_name) results = results.filter(u => u.last_name.toLowerCase().includes(last_name.toLowerCase()));

        // Age range filter
        if (age) {
            const [min, max] = age.split('-').map(a => parseInt(a.trim(), 10));
            if (!isNaN(min)) results = results.filter(u => u.age >= min);
            if (!isNaN(max)) results = results.filter(u => u.age <= max);
        }

        // Salary range filter
        if (salary) {
            const [min, max] = salary.split('-').map(a => parseFloat(a.trim()));
            if (!isNaN(min)) results = results.filter(u => u.salary >= min);
            if (!isNaN(max)) results = results.filter(u => u.salary <= max);
        }

        // Last login filter
        if (lastLogin) {
            if (lastLogin.toLowerCase() === 'never') {
                results = results.filter(u => !u.last_login_date);
            } else {
                results = results.filter(u => {
                    if (!u.last_login_date) return false;
                    const loginDate = new Date(u.last_login_date);
                    return !isNaN(loginDate) && loginDate.toISOString().split('T')[0].includes(lastLogin);
                });
            }
        }

        // --- Registration filters ---
        if (regFilterType) {
            const todayStr = new Date().toISOString().split('T')[0];

            if (regFilterType === 'today') {
                results = results.filter(u => {
                    if (!u.registration_date) return false;
                    const regDate = new Date(u.registration_date);
                    return !isNaN(regDate) && regDate.toISOString().split('T')[0] === todayStr;
                });
            } else if ((regFilterType === 'same-day-user' || regFilterType === 'after-user') && regFilterUser) {
                const refUser = await db.searchByUsername(regFilterUser);

                if (!refUser || refUser.length === 0 || !refUser[0].registration_date) {
                    console.warn("Reference user not found or missing registration date. Skipping filter.");
                } else {
                    const refDate = new Date(refUser[0].registration_date);
                    if (!isNaN(refDate)) {
                        results = results.filter(u => {
                            if (!u.registration_date) return false;
                            const regDate = new Date(u.registration_date);
                            if (isNaN(regDate)) return false;

                            if (regFilterType === 'same-day-user') return regDate.toDateString() === refDate.toDateString();
                            if (regFilterType === 'after-user') return regDate >= refDate;
                        });
                    }
                }
            }
        }

        res.json({ data: results });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});



// configures node js application on port in .env
// set up web server listener
// works whether or not we use .env to configure on port 5050
app.listen(process.env.PORT || 5050, 
    () => {
        console.log(`Server running on http://localhost:${process.env.PORT}/`)
    }
);


