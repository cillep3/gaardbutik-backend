// KOMMENTAR Her tester vi om devStart virker
//console.log("TEST");

// KOMMENTAR Her åbner vi for vores express server
const express = require("express");
const cors = require("cors"); // Her kalder vi på CORS som vi har installeret

require("dotenv").config();

const app = express(); // Hent express portnummer fra env-fil
const PORT = process.env.PORT || 4011; // Hent portnummer fra env-fil

// KOMMENTAR DB Mongo og Mongoose
// --------------------------------------------------
const mongoose = require("mongoose");

// KOMMENTAR LOKAL DATABASE DB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// KOMMENTAR EKSTERN DB
/* mongoose.connect(process.env.DB_URL_EXT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */

const db = mongoose.connection; // skab forbindelse
db.on("error", (error) => console.log("FEJL:" + error));
db.once("open", () => console.log("/// ---> MongoDB er klar!"));



// KOMMENTAR APP
// --------------------------------------------------
// HERUNDER sætter vi de forskellige data typer ind som databasen skal kunne læse. json, form data og form-encodet

app.use(express.json()); // håndter POST/PUT data som json
app.use(express.urlencoded({ extended: true })); // Håndterer POST/PUT data som form-encodet
app.use(cors({ credentials: true, origin: true })); // CORS
app.use(express.static('public')); // Når der hentes uploadet filer/billeder fra serveren - hvor de skal/må hentes fra


// *** SESSION
// KOMMENTAR SESSION https://www.npmjs.com/package/express-session
// --------------------------------------------------
const session = require('express-session');
const MongoStore = require('connect-mongo');

const expire = 1000 * 60 // hvar gang der bliver lavet en session skal den expire efter et minut

app.use(session({

    name: process.env.SESSION_NAME,
    // hvis rolling er true + resave er true -> så fornyes sessoin ved hvert request - starter man forfra
    // hvis rolling er false + resave er false -> så fornyes hverken session eller cookie
    resave: true, // skal session resaves ved aktivitet
    rolling: true,
    saveUninitialized: false, // 
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: expire,
        sameSite: 'strict', // 'none' 'lax'
        secure: false, // hvis https så skift til true hvis den skal op på HEROKU
        httpOnly: true, // vigtigt - session-cookie som ikke kan manipuleres med javascript
    }

}));


// KOMMENTAR AUTH TJEK - tjek om bruger er "logget ind" (har godkendt cookie)
// * betyder hvad som helst foran og hvad som helst bagved
// fx. http://localhost/4011


// *********
// KOMMENTAR UDKOMMENTER denne del hvis du vil lave ændringer på REACT delen 
// **** HUSK AT KOMMENTER DEN IND IGEN
// --------------------------------------------------
app.use('*/admin*', async (req, res, next) => {

    //Det vi tjekker her er - Hvis bruger er logeet ind
    // -og Hvis ikke...

    if (req.session && req.session.userId) {
        // fortsæt videre ...
        return next();

    } else {

        return res.status(401).json({ message: 'Du har ikke adgang....' })

    }

})




// KOMMENTAR ROUTES
// --------------------------------------------------

// Serverens endpoint -"Landingpage"
app.get("/", async (reg, res) => {
    console.log("Serverens endpoint!");
    return res.status(200).json({ message: "Hilsen fra server" });
});


//***Udkommenter denne hvis der ikke er noget i .routes filen */
app.use("/gaardbutikken", require("./routes/gaardbutikker.routes.js"));
app.use("/user", require("./routes/user.routes.js"));
app.use("/login", require("./routes/login.routes.js"));






// KOMMENTAR LISTEN
// --------------------------------------------------

app.listen(PORT, () =>
    console.log("/// -----> SERVEREN LYTTER PÅ PORT:" + PORT)
);
