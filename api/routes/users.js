var express = require('express');
var router = express.Router();
const User = require('../models/User');

//GET users listing
router.get('/', async (req, res) => {
try{
  if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  const user = await User.findById(req.session.userId.toString()).select('-password');
  console.log("User found:", user);

  if(!user){
    return res.status(404).json({ error: "User not found"});
  }
  res.json(user);
}catch(error){
  return res.status(500).json({error:  "Server error" });
}
});

module.exports = router;
