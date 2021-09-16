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





// KOMMENTAR ROUTES
// --------------------------------------------------

// Serverens endpoint -"Landingpage"
app.get("/", async (reg, res) => {
    console.log("Serverens endpoint!");
    return res.status(200).json({ message: "Hilsen fra server" });
});


//***Udkommenter denne hvis der ikke er noget i .routes filen */
app.use("/gaardbutikken", require("./routes/gaardbutik.routes.js"));





// KOMMENTAR LISTEN
// --------------------------------------------------

app.listen(PORT, () =>
    console.log("/// -----> SERVEREN LYTTER PÅ PORT:" + PORT)
);
