#Full Stack Restaurant Web Application

This is a full stack web application for a restaurant

Author: Kaniz Sinethyah

To run the server:
1. Require 2 command prompt terminals
2. In first command prompt terminal, first move to the directory where the project folder is located, then
    type the following commands:
    a. 'mkdir database' and hit enter and
    b. 'mongod --dbpath=database'
3. In the second terminal, move to the assignment folder dir and type 
    a. mongo 
4. In the visual studio terminal, type 
    a. 'npm install' to install all dependencies
    b. 'node database-initializer.js'
    c. 'node server.js'

This will run the server at localhost:3000

Design decisions:

Mongodb is used to store the userprofile, orderdata and session data

After running 'node database-initializer.js', 'a4' database would be initialized. 
The a4 database contains:
1. 'users' collection initially after running 'node database-initializer.js'
2. After placing an order, 'orders' collection would also be added to the a4 database 

Another database: 'session_test' stores the session data 
3. It has 'mySessions' collection
 


Files and their functions:
1. server.js has 2 routes: user-router.js that deals with user and order-router.js that 
deals with order information
2. login.pug page renders page to enter credentials to log in 
3. register.pug page renders page to register a new user.
4. order.pug is rendered to display each order information of a particular user 
5. orderform.pug renders orderform.html file 
6. ordersummary.pug renders the summary of all the orders that a particular user has ordered 
7. userprofile.pug is the user's profile page 
8. users.pug renders all the non-private users
9. home.pug page renders the home page 
10. client.js has a function to deal with the put request (privacy change)
11. add.png and remove.png adds and removes items respectively.




