const Gaardbutik = require('../models/gaardbutik.model')

const express = require("express");
const router = express.Router();


// ** MULTER 
const multer = require('multer');

const upload = multer({

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/')
        },
        filename: function (req, file, cb) {
            //cb(null, file.originalname) // her bevares navnet
            cb(null, Date.now() + '-' + file.originalname) // her kommer der dato først i navnet
        }
    })

})

// POST METODE - opret en gårdbutik
router.post('/admin', upload.single('image'), async (req, res) => {

    console.log('POST - gaardbutikker');

    try {

        let gaardbutik = new Gaardbutik(req.body);
        gaardbutik.image = req.file.filename

        gaardbutik = await gaardbutik.save();

        res.status(201).json({ message: 'Ny er oprettet', oprettet: gaardbutik })

    } catch (error) {

        res.status(400).json({ message: ' Der er sket en fejl' })

    }

})


// **** Hente alle Gårdbutikker
// GET METODE 

router.get("/", async (req, res) => {

    console.log("GET/hent alle gaardbutikker");

    try {
        let gaardbutikker = await Gaardbutik.find(); // find alle

        return res.status(200).json(gaardbutikker);

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});

// ** ID
// GET METODE Hent et udvalgt Gårdbutikker - ud fra produkt ID

router.get("/:id", async (req, res) => {

    console.log("GET/hent et udvalgt butik ud fra ID", req.params.id);

    try {
        let gaardbutik = await Gaardbutik.findById(req.params.id); // find med ID

        return res.status(200).json(gaardbutik);

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});

// ***** SØG 
// GET METODE Søge efter Gårdbutikker - ud fra et søgeord

router.get("/search/:searchkey", async (req, res) => {

    console.log("GET gårdbutikker ud fra søgning", req.params.searchkey);

    try {
        //@or betyder at ordet der søges efter enten skal komme frem det ene eller andet sted
        let gaardbutikker = await Gaardbutik.find({
            $or: [
                // søg efter søgeordet - om det indgår et sted i titel eller content - både store og små bogstaver regnes med (i)
                { navn: { $regex: req.params.searchkey, $options: "i" } },
                { adresse: { $regex: req.params.searchkey, $options: "i" } },
                { beskrivelse: { $regex: req.params.searchkey, $options: "i" } },
                { image: { $regex: req.params.searchkey, $options: "i" } }

            ]
        });

        return res.status(200).json(gaardbutikker);

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});


// PUT METODE - Ret en gaardbutik - ud fra butikkens ID

router.put('/admin/:id', upload.single('image'), async (req, res) => {

    console.log('PUT/ret - gaardbutik');

    try {
        // hvis der er img med - må det betyde at det nuværende billede skal erstattes
        // = snup filnavnet på det billede som Multer lige har oprettet i upload.single

        if (req.file) {

            req.body.image = req.file.filename

        }

        let gaardbutik = await Gaardbutik.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })

        gaardbutik.save();

        res.status(201).json({ message: 'Butik er rettet', oprettet: gaardbutik })

    } catch (error) {

        res.status(400).json({ message: ' Der er sket en fejl' })

    }

})


// DELETE - Slet en butik
// --------------------------------

router.delete("/admin/:id", async (req, res) => {

    console.log("SLET et udvalgt gaardbutik ud fra ID", req.params.id);

    try {

        await Gaardbutik.findByIdAndDelete(req.params.id); // slet udvalgt - ud fr id

        return res.status(200).json({ message: " gaardbutikken er slettet" });

    } catch (error) {

        console.log("FEJL:", error);
        return res.status(500).json({ message: "Problemer med serveren" });
    }
});




module.exports = router;

