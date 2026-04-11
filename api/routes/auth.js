const express = require('express');
const router = express.Router();
const bcrypt = require ('bcrypt');

const User = require('../models/User');

//Register user
router.post('/register',async(req,res)=> {
   try{
        const{name,email,password,university,year,course} = req.body;

        // validation checks 
        //if name, email or password is not filled 
        if(!name || !email || !password){
            return res.status(400).json({ error: "All required field must be filled " });
        }
        
         if (!email.includes('@')) {
            return res.status(400).json({ error: "Valid email required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
            }

        // checks if the user exists
        const existingUser = await User.findOne({ email});

        if( existingUser) {
            return res.status(400).json({error: "user already exists"});
        }

        // Hashing password 
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // creating the user 
        const user = new User({
            name,
            email,
            password: hashedPassword,
            university,
            year,
            course
        });
        // saving new user 
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

        // checks the fields 
        if(!email || !password){
            return res.status(400).json({ error: " Email and password are required" });
        }

         // finding the user 
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ error: "User not found "});
        }

        //comparing password 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: " Invalid credentials  "});
        }

        //Creating session 
        req.session.userId = user._id.toString();;
        

        // sets cookie 
        res.cookie('username', user.name, {
            maxAge: 86400000 // 1 day
        });
        
        res.status(200).json({ message: "Login successful" });

    }catch (error) {
    res.status(500).json({ error: "Server error" });
    }
});

//logout user 
router.post('/logout', async(req,res) => {
    try{
        // destroying session 
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({ error: " Logout failed"});
            }
        
            // clearing cookies
            res.clearCookie('connect.sid'); //session cleared
            res.clearCookie('username'); // custom cookie 

            res.status(201).json({ message:  "Logout successful"});
        });
    }catch(error){
        res.status(500).json({ error: "Server error"});
    }
});

module.exports = router;