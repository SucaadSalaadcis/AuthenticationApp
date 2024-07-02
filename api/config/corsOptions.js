const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
    origin: (origin, callback) => {
        // index 0 !== -1 means xog lahaya !orgin means origin: true waye 
      if(allowedOrigins.indexOf(origin)!==-1 || !origin){
          // returns error or value of origin , null b/c there is no err , true means the origin value
        callback(null,true)
      }else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    // credentials ay bayanat we send to header or cookie uu aqbalo inusan didin
    credentials: true,
    optionsSuccessStatus: 200

};

module.exports = corsOptions;