require("dotenv").config(); // load all the variables in the env file

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/dbConnect");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const PORT = process.env.PORT || 5000;


// db connect
connectDB();
app.use(cors(corsOptions));

// tell the server accetp cookies
app.use(cookieParser());
// tell the server accept json 
app.use(express.json());

// we are using static file 
app.use("/", express.static(path.join(__dirname, "public")));



app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
// app.use(require('./routes/authRoutes'))


// path ka asameystey mid an ahyn hdi la ado
app.all("*",(req, res) => {
    res.status(404);
    // hdu webApplication yahy means if using browser html file
    if(req.accepts("html")){
         res.sendFile(path.join(__dirname,"views","404.html"));

         // if using browser but its json file
    }else if (req.accepts("json")){
        res.json({message: "404 Not Found"});

        // anything else like mobleApp
    }else {
     res.type("txt").send("404 Not Found")
    }

})

// when i connect to the data base
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
})

// marku error dhaco
mongoose.connection.on("error",(error) => {
  console.log(error)
})


// env file ka wax kujiro
// DATABASE_URI="mongodb+srv://sucaadsalaadosman:TWY90p6KBECYtEez@cluster0.6cf33p0.mongodb.net/auth-app?retryWrites=true&w=majority&appName=Cluster0"
// NODE_ENV="development"

// # node env wuxu qoamina  develpment or production

// node -e "console.log( require('crypto').randomBytes(24).toString('base64url'))" generating key



