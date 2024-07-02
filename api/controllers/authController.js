const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 400: invalid syntax 401: invalid credentials

const register = async (req, res) => {

    const { first_name, last_name, email, password } = req.body;

    // user ka hdu sodirin xogta
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    // checking if user exists // exec means execute
    const foundUser = await User.findOne({ email }).exec();

    if (foundUser) {
        return res.status(401).json({ message: "User already exists" })
    }
    // new user
    // hash(datadahashubadalilahaay,10 adkeynta passwordka ,15 wusiadkeyna)
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating user
    const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword
    });
    // credential sign create our accesstoken // generating token from jsonwebtoken
    // creates access token 
    // unique info from user like _id
    // the access token we send to the header
    // sign takes to params 1 obj 2 private key 
    const accessToken = jwt.sign({
        userInfo: {
            id: user._id
        }
        // secret key // waqtigo dhamanayo token kada
    },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20m" }
    );
    // refresh token // update token 
    const refreshToken = jwt.sign({
        userInfo: {
            id: user._id
        }
        // secret key // waqtigo dhamanayo token kada
    },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }

        // store into cookie of the browser
    );
    // this token store in the browser wa refresh token 
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // access only by web server ,devlopment stage, http protocol
        secure: true, // https in the production stage
        sameSite: "None", // none  means 2 domains : main domain and subdomain // cross site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // week d/n hour sec min  
    })
    res.json({
        accessToken,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    }); // req kasto dirayo wxa racsina token kaan
}






// login
const login = async (req, res) => {

    const { email, password } = req.body;

    // user ka hdu sodirin xogta
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    // checking if user exists // exec means execute
    const foundUser = await User.findOne({ email }).exec();
    // console.log(foundUser)

    // if not exists
    if (!foundUser) {
        return res.status(401).json({ message: "User doesn't exists" })
    }

    // compare(passwordka userka sogalinayo req.body, encripted password horey ujiray) 
    // compare() means compare the too passwords kanlasogaliyey inu yahy midjiro
    const match = await bcrypt.compare(password, foundUser.password);
    // hdey labada password iskumid ahyn
    if (!match) {
        return res.status(401).json({ message: "Wrong Password" })
    }


    // credential sign create our accesstoken // generating token from jsonwebtoken
    // creates access token // unique info from user like _id 
    // means userkan imisa daqiiqad/sacad uu kujira serverka 
    // token is a private key 
    const accessToken = jwt.sign({
        userInfo: {
            id: foundUser._id,
            email: foundUser.email
        }
        // secret key // waqtigo dhamanayo token kada
    },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" }
    );
    // refresh token // update token 
    const refreshToken = jwt.sign({
        userInfo: {
            id: foundUser._id
        }
        // secret key // waqtigo dhamanayo token kada
    },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }

        // store into cookie of the browser
    );
    // this token store in the browser
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // access only by web server ,devlopment stage, http protocol
        secure: true, // https in the production stage
        sameSite: "None", // none  means 2 domains : main domain and subdomain // cross site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // week d/n hour sec min  
    })

    res.json({
        accessToken,
        email: foundUser.email,
        // found: foundUser wa userki oo dhan
        // password: foundUser.password
    }); // req kasto dirayo wxa racsina token kaan

}




// refresh token
const refresh = async (req, res) => {
    const cookies = req.cookies; // returns all cookie but we need  cookie anaga store mesha ku store gareyney
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" }); // cos you don't have cookie
    // getting token from the browser/ cookie and give you new token
    const refreshToken = cookies.jwt;
    // compare with secret key
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            const foundUser = await User.findById(decoded.userInfo.id).exec(); // only one user
            // user ka hado jirin why new access token logu sameyna or refrsh token
            if (!foundUser) return res.status(401).json({ message: "User doesn't exists" })

            // new access token
            const accessToken = jwt.sign({
                userInfo: {
                    id: foundUser._id,
                    email: foundUser.email
                }
                // secret key // waqtigo dhamanayo token kada
            },
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }
            );
            res.json(accessToken);
        })
}


// logout
const logout = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    // we have token we want to remove it
    res.clearCookie("jwt", {
        httpOnly: true, 
        secure: true, 
        sameSite: "None",
    });
    // send marka dhahdid cookie wa la clear garyna
    res.json({message: "Cookie cleared"});
}

module.exports = {
    register,
    login,
    refresh,
    logout
}