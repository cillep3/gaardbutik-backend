// KOMMENTAR Dette er LOGIN USER siden

const User = require("../models/user.model");

const express = require("express");
const router = express.Router();

// Håndter formdata(POST METODE og PUT METODE)
const formData = require("express-form-data");
router.use(formData.parse());



// ****** LOGIN **********

// POST METODE

router.post("/", async (req, res) => {

    console.log("POST/Login");


    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "Bruger findes ikke ud fra email" });
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {

                // Cookie
                req.session.userId = user._id;

                res.status(200).json({ message: "Login lykkes", name: user.name, user_id: user._id })


            } else {
                // clearcookie
                return res.status(401).json({ message: "Password matcher ikke bruger" });
            }
        })

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});


// ***** LOGUD *********
// -----------------------------
// GET METODE http://localhost:4011/login/logout
router.get('/logout', async (req, res) => {
    // herinde skrives alt logikken

    console.log("LOGUD");

    // slet session på server
    req.session.destroy(err => {

        // fejl i destroy af session
        if (err) return res.status(500).json({ message: 'Logud lykkes ikke' })

        // Få browseren til at clear/slet
        res.clearCookie(process.env.SESSION_NAME).json({ message: 'cookie er slettet' })

    })

})



// ***** LOGGET IND (Er jeg STADIG? logget ind)
// -----------------------------
// GET METODE http://localhost:4011/login/loggedin

router.get('/loggedin', async (req, res) => {
    // herinde skrives alt logikken

    console.log("ER JEG STADIG LOGGET IND?");

    if (req.session.userId) {
        return res.status(200).json({ message: "Login er aktivt", login: true })

    } else {
        return res.status(401).json({ message: 'Login eksisterer ikke eller er udløbet', login: false })
    }

})




// KOMMENTAR Husk at eksportere

module.exports = router;
