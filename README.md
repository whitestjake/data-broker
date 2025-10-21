This project is a way to demonstrate database communication and sorting through that data for an easier to interact with user interface

1. We will use the Apache web server. Create the first webpage index.html under ```C:\xampp\htdocs``` (or whatever directory you installed XAMPP) and point your browser to ```http://localhost/index.html``` and 
you should see your first webpage. The purpose of this step is to confirm that the Web server is running, and understand the ROOT URL points to the path location: C:\xampp\htdocs or similar directory in your file system.
Start your Apache Web Server and MySQL server as well as you will be using these to actually run the program
2. At your ```C:\xampp\htdocs``` directory (which will vary depending on where you installed XAMPP to your device), run ```git clone https://github.com/whitestjake/data-broker``` this will copy the entire code into your directory
3. Now in order to properly access the content, you will need to create your database and table to match this projects, in your project files there will be a file ```sql.txt``` you may copy and paste the contents of this file into your SQL to create the respective database and table
4. Now you will need to create a .env file in your backend, ours looks like this, but you will need to edit yours based on what will work for your database configuration
   ```
   PORT=5050
   DB_USER=root
   PASSWORD=
   DATABASE=dse6100_project1
   DB_PORT=3306
   HOST=localhost
   ```
5. Now that you have the proper files in place and your database set up, you can start the backend by first making sure you are in the proper file directory, if you open up your code using the data-broker file directly ``` cd Backend ``` into your directory and then run the command ``` npm install express mysql cors nodemon dotenv bootstrap ```, alternatively you can just type ``` npm install ``` into your terminal and it should download all already included dependencies on it's own and once these modules are installed, go into your package.json file in the backend and below ```"main": "app.js",```, add ```"type": "module",``` to the file and save it, you can run ``` npm start ``` to start the node.js server now
6. Now assuming you used the same port as we did to set up your .env file, you may access the project by pointing your browser to ``` http://localhost:5050/ ``` which is the index page unless of course you decided to use a different port in which case you must replace 5050 with whatever number you decided to use, you will need to manually register a few users yourself in order to properly test the web pages functionality while you could manually enter users into the SQL database directly this will cause issues with how passwords are hashed
7. Once you have a few users registered, all functionality should be fully usable and you can use the login page, registration page and test all the search functionality within the homepage itself
