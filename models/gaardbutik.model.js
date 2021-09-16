const mongoose = require("mongoose");

const butikSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: [true, "HUSK navn på butik"],
    },
    adresse: {
        type: String,
        require: [true, " HUSK adressen"],
    },
    beskrivelse: {
        type: String,
        require: [true, " Beskriv butikken"],
    },
    image: {
        type: String,
        required: [true, "Husk at uploade et billede"]
    }
});

module.exports = mongoose.model("Gaardbutik", butikSchema, "gaardbutikker");