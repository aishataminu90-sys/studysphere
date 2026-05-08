const express = require('express');
const router = express.Router();
const bcrypt = require ('bcrypt');

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

//Register user
router.post('/register',async(req,res)=> {
   try{
        const{name,email,password,university,year,course} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ error: "All required field must be filled " });
        }
        
         if (!email.includes('@')) {
            return res.status(400).json({ error: "Valid email required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
            }

        const existingUser = await User.findOne({ email});

        if( existingUser) {
            return res.status(400).json({error: "user already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            university,
            year,
            course
        });
        await user.save();

        res.status(201).json({message:"User registered successfully" });
   }catch{
    res.status(500).json({ error: "server error"})
   }
});

//login user 
router.post('/login', async(req,res) => {
    try{
        const{email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ error: " Email and password are required" });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ error: "User not found "});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: " Invalid credentials  "});
        }

        req.session.userId = user._id.toString();
        
        res.cookie('username', user.name, {
            maxAge: 86400000
        });
        
        res.status(200).json({ message: "Login successful" });

    }catch (error) {
    res.status(500).json({ error: "Server error" });
    }
});

//logout user 
router.post('/logout', async(req,res) => {
    try{
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({ error: " Logout failed"});
            }
        
            res.clearCookie('connect.sid');
            res.clearCookie('username');

            res.status(201).json({ message:  "Logout successful"});
        });
    }catch(error){
        res.status(500).json({ error: "Server error"});
    }
});

// Get current logged-in user
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in" });
    }
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;