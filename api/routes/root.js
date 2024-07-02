const express = require('express');
const router = express.Router();

const path = require("path"); // from nodejs

// C:\Users\HP\Desktop\Authentication\api\routes means mesha a jogtid kushega
// console.log(path.join(__dirname));

// hda banka adey  C:\Users\HP\Desktop\Authentication\api\views
// console.log(path.join(__dirname, "..", "views","index.html"));


//   functionka  wa middle ware do a specific tesk
router.get("/", (req, res) => {
    // we want to return html page
    // file so baxyo index.html file
     res.sendFile(path.join(__dirname, "..", "views","index.html"))
})

module.exports = router;