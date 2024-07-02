const jwt = require('jsonwebtoken');

// checks if the user exists  through the access token
const verifyJWT = async(req, res, next) => {
    // headers ka midka lgukeydiyo wa access token waye key
    // headers badan jiran midka authorization ubahanahy kas token keena kujira
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // cheking if header have access token
  // ?  means undefined
  // means hadu null io undefined kanabilabaneynin (Bearer +space ) no token provided
  if(!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  // const token = authHeader.split(" ") // [Bearer: token] 
  const token = authHeader.split(" ")[1] // [token] returns our token 
  // chicking the token is the token that we have in the server
 // verify takes too param(token to check,secret key of access token, and call back func too param (err,furfur token ki))
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decode) => {
    // means match ma greynoyo midka serverka kujiro , forbidden means not allowed
    // hdu access token kado dhamadana forbidden b/c new token la generate gareyay kas in soqadatid waye
    if(err) return res.status(403).json({ message: "Forbidden" });
     // get user id
     req.userId = decode.userInfo.id

    // go to other middle wareif its true
    next();
  })
}

module.exports = verifyJWT;