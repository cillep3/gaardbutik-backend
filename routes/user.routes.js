// KOMMENTAR Dette er USER siden

const User = require("../models/user.model");

const express = require("express");
const router = express.Router();

// Håndter formdata(POST METODE og PUT METODE)
const formData = require("express-form-data");
router.use(formData.parse());

// OPRET EN BRUGER

// POST METODE OG DELETE giver ikke mening på en side OM oS  - der skal altid være 1 dokument som man skal rette i = PUT
router.post("/", async (req, res) => {
    console.log("POST/opret ny user/bruger");
    //return res.status(200).json({ message: "Hilsen fra about" });

    try {
        let user = new User(req.body); //req.body indeholder de data(titel, content) som skal oprettes

        await user.save(); // gem i DB

        return res.status(200).json({ message: "Ny er oprettet", opretter: user });
    } catch (error) {
        console.log("FEJL:", error);

        return res.status(500).json({ message: "Problemer med serveren" });
    }
});

// KOMMENTAR Husk at eksportere

module.exports = router;
