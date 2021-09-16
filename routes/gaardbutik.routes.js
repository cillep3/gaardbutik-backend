const Gaardbutik = require('../models/gaardbutik.model')

const express = require("express");
const router = express.Router();


// MULTER 
//til håndtering af filer (fx images) https://www.npmjs.com/package/multer
// cb betyder call back - håndtering af destinationen
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

// POST METODE - opret et produkt
router.post('/admin', upload.single('image'), async (req, res) => {

    console.log('POST - gaardbutikker');

    try {

        let gaardbutik = new Gaardbutik(req.body);
        gaardbutik.image = req.file.filename
        //produkt.image = req.file ? req.file.filename : 'paavej.jpg'

        gaardbutik = await gaardbutik.save();

        res.status(201).json({ message: 'Ny er oprettet', oprettet: gaardbutik })

    } catch (error) {

        res.status(400).json({ message: ' Der er sket en fejl' })

    }

})

module.exports = router;
