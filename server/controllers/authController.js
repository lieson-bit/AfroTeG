const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 SIGN-UP (EMAIL & PASSWORD)
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, country, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            firstName, lastName, email, password: hashedPassword, country, role
        });

        await newUser.save();

        // Generate JWT Token
        const token = generateToken(newUser._id);

        res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 LOGIN (EMAIL & PASSWORD)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 GET CURRENT USER DATA
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 GOOGLE AUTH CALLBACK
exports.googleAuth = async (req, res) => {
    try {
        const { id, email, given_name, family_name, picture } = req.user;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                firstName: given_name,
                lastName: family_name,
                email,
                profilePic: picture,
                role: "freelancer",
                country: "Unknown",
                password: "", // No password needed for Google users
            });

            await user.save();
        }

        const token = generateToken(user._id);
        res.redirect(`${process.env.CLIENT_URL}/auth?token=${token}`);
    } catch (error) {
        res.status(500).json({ message: "Google authentication failed", error: error.message });
    }
};

