// KOMMENTAR Dette er USER siden

const User = require("../models/user.model");

const express = require("express");
const router = express.Router();

// Håndter formdata(POST METODE og PUT METODE)
const formData = require("express-form-data");
router.use(formData.parse());

// OPRET EN BRUGER

// POST METODE
router.post("/", async (req, res) => {
    console.log("POST/opret ny user/bruger");

    try {
        let user = new User(req.body); //req.body indeholder de data(titel, content) som skal oprettes

        await user.save(); // gem i DB

        return res.status(200).json({ message: "Ny er oprettet", opretter: user });
    } catch (error) {
        console.log("FEJL:", error);

        return res.status(500).json({ message: "Problemer med serveren" });
    }
});


// PUT METODE - RET EN BRUGER - ud fra brugerens id

router.put('/:id', async (req, res) => {

    console.log('PUT/ret - user');

    try {


        let user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })

        user.save();

        res.status(201).json({ message: 'Brugeren er rettet', oprettet: user })

    } catch (error) {

        res.status(400).json({ message: ' Der er sket en fejl' })

    }

})

// **** Hente alle Brugere
// GET METODE 

router.get("/", async (req, res) => {

    console.log("GET/hent alle brugere");


    try {
        let users = await User.find(); // find alle

        return res.status(200).json(users);

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});


// ** DELETE - Slet en bruger med ID
// --------------------------------

router.delete("/:id", async (req, res) => {

    console.log("SLET et udvalgt bruger ud fra ID", req.params.id);


    try {

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: " Brugeren er slettet" });

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});



// KOMMENTAR Husk at eksportere

module.exports = router;
