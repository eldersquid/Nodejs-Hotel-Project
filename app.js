/*
 * 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
 * in this JS file.
 * */
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cors = require('cors');
const fs = require('fs');
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const Stripe = JSON.parse(fs.readFileSync('credentials/stripePayment.json')); //Gerald's stripe payment gateway
console.log(Stripe.Public_Key);

const passport = require('passport');
// Messaging libraries
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
// const nodemailer = require('nodemailer')
// const { google } = require('googleapis')
// const CLIENT_ID = '855734212452-4ti1go2pp7ks8os3o98ragh1k8gh2mtb.apps.googleusercontent.com'
// const CLIENT_SECRET = '6Wm2bPALLsbf2s_H_R-jJpa1'
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04wi_I-DuOpscCgYIARAAGAQSNwF-L9Ir2mNKa0_6ofjTLeipoCL6YqO2WPMgFOHd9rNC8RLr4TPBVj4PGQJU5B0i1V-2qsrqnAw';
// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

// async function sendMail() {

//     try {
//         const accessToken = await oAuth2Client.getAccessToken();
//         const transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'gabewungkana5@gmail.com',
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken
//             }
//         })

//         const mailOptions = {
//             from: 'GABE :) <gabewungkana5@gmail.com>',
//             to: 'progenji81@gmail.com',
//             subject: "Reset Password",
//             text: 'Dear  ,\n\nThis is your new password, lololol.   \n Sincerely,\nHotel La Bodo'

//         };

//         const result = await transport.sendMail(mailOptions);
//         return result;

//     } catch (error) {
//         return error
//     }
// }
// sendMail().then(result => console.log('Email sent...', result))
//     .catch(error => console.log(error.message));
/*
 * Loads routes file main.js in routes directory. The main.js determines which function
 * will be called based on the HTTP request and URL.
 */
const mainRoute = require('./routes/main');

const restaurantRoute = require('./routes/restaurant');

const admRestaurantRoute = require('./routes/admRestaurant');

const adminRoute = require('./routes/admin');

const roomsRoute = require('./routes/rooms');

const supplierRoute = require('./routes/supplier');

const inventoryRoute = require('./routes/inventory');

const ordersRoute = require('./routes/orders');

const facilitiesRoute = require('./routes/facilities');

const admFacilitiesRoute = require('./routes/admFacilities');

const ChatBotRoute = require('./routes/ChatBot');

const adminDB = require('./config/DBConnection');

const Swal = require('sweetalert2');

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const Handlebars = require('handlebars');

const SignupRoute = require('./routes/profile');









const { replaceCommas } = require('./helpers/hbs');
// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session');
const db = require('./config/db');

// const Reservation = require('./models/Reservation');

// 1. Danish's Route
// const roomsRoute = require('./routes/rooms');

/*
 * Creates an Express server - Express is a web application framework for creating web applications
 * in Node JS.
 */
const app = express();



adminDB.setUpDB(false); // Set up database with new tables (true)

// Handlebars Middleware
/*
 * 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
 * from Node JS.
 *
 * 2. Node JS will look at Handlebars files under the views directory
 *
 * 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
 *
 * */
app.engine('handlebars', exphbs({
    helpers: {
        replaceCommas: replaceCommas
    },
    defaultLayout: 'main', // Specify default template views/layout/main.handlebar 
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars');
// app.set('view engine', 'ejs');



// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
    key: 'hotel_session',
    secret: 'bodo',
    store: new MySQLStore({
        host: db.host,
        port: 3306,
        user: db.username,
        password: db.password,
        database: db.database,
        clearExpired: true,
        // How frequently expired sessions will be cleared; milliseconds:
        checkExpirationInterval: 900000,
        // The maximum age of a valid session; milliseconds:
        expiration: 900000,
    }),
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Place to define global variables - not used in practical 1
// Two flash messenging libraries - Flash (connect-flash) and Flash Messenger
app.use(flash());
app.use(FlashMessenger.middleware);
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const authenticate = require('./config/passport');
const supplier_authenticate = require('./config/supplierpassport');
authenticate.localStrategy(passport);
supplier_authenticate.localStrategy(passport);




// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use(function(req, res, next) {
    next();
});


// Use Routes
/*
 * Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
 * mainRoute which was defined earlier to point to routes/main.js
 * */
app.use('/', mainRoute); // mainRoute is declared to point to routes/main.js
// This route maps the root URL to any path defined in main.js

// app.use('/rooms', roomsRoute); // mainRoute is declared to point to routes/main.js
// This route maps the root URL to any path defined in main.js



app.use('/admin', adminRoute); // mainRoute is declared to point to routes/main.js
// This route maps the root URL to any path defined in main.js

app.use('/restaurant', restaurantRoute);

app.use('/admRestaurant', admRestaurantRoute);

app.use('/supplier', supplierRoute);

app.use('/inventory', inventoryRoute);

app.use('/orders', ordersRoute);

app.use('/profile', SignupRoute);

app.use('/facilities', facilitiesRoute);

app.use('/admFacilities', admFacilitiesRoute);

// 2. roomsRoute is declared to point to routes/rooms.js
// This route maps the rooms URL to any path defined in rooms.js
app.use('/rooms', roomsRoute);

app.use('/chatBot', ChatBotRoute);

// google login
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.googleId || user.id);
});

passport.deserializeUser((user, done) => {
    User.findOne({ googleId: googleId }, function(err, user) {
        done(null, user);

    });
});

passport.use(
    new GoogleStrategy({
            clientID: '807209658055-3n1acfo5en7l80ul66vl65dblbs3tu21.apps.googleusercontent.com',
            clientSecret: 'ZfmnW-e0It9zyp-IxiqbS5ZM',
            callbackURL: "http://localhost:5000/googleauth/google/home"
        },
        function(accessToken, refreshToken, profile, cb) {
            // Register User 
            console.log(profile);
            cb(null, profile);

            // User.findOne({ where: { username: profile.id, google_id: profile.id, usertype: 'customer' } })
            // .then(Customer => {
            // 	if (Customer) {
            // 		cb(null, Customer);
            // 	}
            // 	else {
            // 		console.log(profile);
            // 		let firstname = profile.displayName.split(' ')[0];
            // 		let lastname = profile.displayName.split(' ')[1];
            // 		var password = generator.generate({
            // 			length: 10,
            // 			numbers: true
            // 		});
            // 		// console.log('passsssssworrrdddd',password);
            // 		bcrypt.genSalt(10, (err, salt) => {
            // 			bcrypt.hash(password, salt, (err, hash) => {
            // 				if (err) throw err;
            // 				password = hash;
            // 				User.create({ username: profile.id, firstname: firstname, lastname: lastname, google_id: profile.id, usertype: 'customer', password: password })
            // 					.then(user => {
            // 						cb(null, user);
            // 					})
            // 					.catch(err => console.log(err));
        }
    ));


app.get('/googleauth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/googleauth/google/home', passport.authenticate('google', { failureRedirect: '/mainlogin' }), (req, res) => {
    res.redirect('/rooms/apartment');
    res.end('Login Successful');
})

// facebook login
const FacebookStrategy = require("passport-facebook").Strategy;
const Signup = require('./models/Signup');
passport.use(new FacebookStrategy({
        clientID: '157881506323867',
        clientSecret: '4ffba1b702ebb0e004d0a63f9dae0ff0',
        callbackURL: "http://localhost:5000/fbauth/facebook/home"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        cb(null, profile);

        //     function(accessToken, refreshToken, profile, done) {
        //         console.log('facebook-->', profile);

        //         Signup.findOne({ where: { facebook_id: profile.id, usertype: 'signup' } })
        //             .then(Signup => {
        //                 if (Signup) {
        //                     done(null, Signup);
        //                 } else {
        //                     let firstname = profile.displayName.split(' ')[0];
        //                     let lastname = profile.displayName.split(' ')[1];
        //                     var password = generator.generate({
        //                         length: 10,
        //                         numbers: true
        //                     });
        //                     bcrypt.genSalt(10, (err, salt) => {
        //                         bcrypt.hash(password, salt, (err, hash) => {
        //                             if (err) throw err;
        //                             password = hash;
        //                             User.create({ username: profile.id, firstname: firstname, lastname: lastname, facebook_id: profile.id, usertype: 'customer', password: password })
        //                                 .then(user => {
        //                                     // alertMessage(res, 'success', user.username + ' Please proceed to login', 'fas fa-sign-in-alt', true);
        //                                     // res.redirect('customer/homecust');
        //                                     done(null, user);
        //                                 })
        //                                 .catch(err => console.log(err));
        //                         })
        //                     });
        //                 }
        //             });
    }
));






app.get('/fbauth/facebook', passport.authenticate('facebook'));
app.get('/fbauth/facebook/home',
    passport.authenticate('facebook', {
        failureRedirect: '/login/stafflogin'
    }),
    function(req, res) {
        res.redirect('/rooms/apartment')
    }
);


/*
 * Creates a unknown port 5000 for express server since we don't want our app to clash with well known
 * ports such as 80 or 8080.
 * */
const port = 5000;

// Starts the server and listen to port 5000
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});