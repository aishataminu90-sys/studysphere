// This route gets the currently logged-in user's details
router.get('/', async (req, res) => {
  try {
    // Check if the user is logged in by verifying session data
    if (!req.session.userId) {
      // If no session exists, return Unauthorized error
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Finds the user in the database using their ID from the session
    // .select('-password') excludes the password field from the result for security
    const user = await User.findById(req.session.userId.toString()).select('-password');

    // Log the found user in the console (useful for debugging)
    console.log("User found:", user);

    // If no user is found in the database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is found, send the user data as a JSON response
    res.json(user);

  } catch (error) {
    // If something goes wrong return a server error
    return res.status(500).json({ error: "Server error" });
  }
});