const User = require("../models/user")


const getAllUsers = async(req, res) => {
    // select: means wx walba so celi ila password ka lean: means obj soceli not document
   const  users = await User.find().select("-password").lean();
   // means eber wye
   if(!users.length) {
    return res.status(400).json({ message: "No Users Found" })
   }
   // if we found users
   res.json(users);
}

module.exports = {
    getAllUsers,
}