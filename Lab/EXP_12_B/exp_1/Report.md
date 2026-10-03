# Experiment 12_B_1: Simple User Login System

## 1. Objective

To create and implement a simple user authentication system using
Node.js and Express.js. The experiment demonstrates user registration,
login authentication, session management, protected routes, logout
functionality, EJS templating, and password hashing using bcrypt.

The main objectives are:

-   Create a user registration page.
-   Accept a username and password from the user.
-   Store registered users temporarily in memory without using a
    database.
-   Authenticate users through a login page.
-   Maintain user sessions using `express-session`.
-   Protect the dashboard route so that only logged-in users can access
    it.
-   Implement logout and destroy the active session.
-   Use EJS to generate dynamic web pages.
-   Hash passwords using bcrypt before storing them.

## 2. Problems Faced

### Problem 1: Managing User Sessions

A normal HTTP request does not automatically remember whether a user has
logged in. Therefore, a mechanism was required to maintain the user's
login state between requests.

### Problem 2: Protecting the Dashboard

The dashboard should only be accessible to authenticated users. Directly
opening `/dashboard` without logging in should not be allowed.

### Problem 3: Password Security

Storing passwords directly as plain text is not a good practice. The
application needed a method to store passwords in hashed form.

### Problem 4: Redirecting Users

After successful registration and login, users need to be redirected to
the appropriate page. Similarly, users should be redirected to the login
page after logout.

### Problem 5: Data Persistence

The exercise does not require a database in its first version.
Therefore, registered users needed to be stored temporarily during
server execution.

## 3. Solutions to Problems

### Solution 1: Express Session

The `express-session` package was used to maintain login sessions.

``` javascript
app.use(session({
    secret:"experiment_secret_key",
    resave:false,
    saveUninitialized:false
}));
```

After successful login, the username is stored in the session:

``` javascript
req.session.user=username;
```

### Solution 2: Protected Route

The dashboard checks whether a session exists before displaying the
page.

``` javascript
if(!req.session.user){
    return res.redirect("/login");
}
```

This prevents unauthenticated users from directly accessing the
dashboard.

### Solution 3: Bcrypt Password Hashing

The `bcrypt` package is used to hash passwords during registration.

``` javascript
const hashedPassword=await bcrypt.hash(password,10);
```

During login, the entered password is compared with the stored hash:

``` javascript
const passwordMatch=await bcrypt.compare(password,user.password);
```

### Solution 4: Redirects

Express `res.redirect()` is used to move the user between pages.

After successful login:

``` javascript
res.redirect("/dashboard");
```

After logout:

``` javascript
res.redirect("/login");
```

### Solution 5: In-Memory User Storage

An array is used to store users temporarily:

``` javascript
let users=[];
```

This avoids the need for a database in the first version of the
experiment. The data is lost when the server is stopped.

## 4. Outcomes

The experiment was successfully implemented with the following
functionality:

-   A user can register with a username and password.
-   Duplicate usernames are rejected.
-   Passwords are hashed using bcrypt.
-   A registered user can log in using valid credentials.
-   Invalid login credentials display an error message.
-   A session is created after successful login.
-   The user is redirected to the protected dashboard.
-   Unauthenticated users are redirected to the login page.
-   The user can log out and destroy the session.
-   EJS is used for dynamic page rendering.
-   The application runs using Node.js and Express.js.
-   Nodemon can be used during development to automatically restart the
    server after code changes.

## 5. Dependencies Required

The project requires the following software and Node.js packages.

### Software Requirements

-   Node.js
-   npm
-   A web browser
-   Visual Studio Code or another code editor

### Node.js Dependencies

  Package             Purpose
  ------------------- ------------------------------------------------------
  `express`           Creates the web server and handles HTTP routes
  `ejs`               Provides server-side HTML templating
  `express-session`   Maintains user login sessions
  `bcrypt`            Hashes and verifies passwords
  `nodemon`           Automatically restarts the server during development

### Installation Command

Run the following command inside the experiment folder:

``` bash
npm install
```

If installing packages individually:

``` bash
npm install express ejs express-session bcrypt
```

For Nodemon:

``` bash
npm install --save-dev nodemon
```

## 6. Commands Run

### Create the Project Folder

``` bash
mkdir EXP_13
cd EXP_13
```

### Initialize Node.js Project

``` bash
npm init -y
```

### Install Required Dependencies

``` bash
npm install express ejs express-session bcrypt
```

### Install Nodemon

``` bash
npm install --save-dev nodemon
```

### Run the Application Normally

``` bash
npm start
```

### Run the Application Using Nodemon

``` bash
npm run dev
```

### Open the Application

``` text
http://localhost:3000
```

### Test Registration

``` text
http://localhost:3000/register
```

### Test Login

``` text
http://localhost:3000/login
```

### Test Dashboard

``` text
http://localhost:3000/dashboard
```

### Test Logout

``` text
http://localhost:3000/logout
```

## 7. Conclusion

The Simple User Login System was successfully developed using Node.js
and Express.js. The experiment provided practical understanding of
registration, authentication, session management, protected routes,
redirects, EJS templating, and password hashing. The implementation uses
temporary in-memory storage as required for the first version and can
later be extended with a database such as MongoDB or MySQL.
