import User from "../model/User.js";

const checkPriviledge = async (req, res, next) => {
    try {
        // Ensure user is authenticated
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized, please log in" });
        }

        // Fetch user from the database
        const checkUser = await User.findById(req.userId);

        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Restrict actions based on role
        if (req.restrictToUser && checkUser.role !== "user") {
            return res.status(403).json({ success: false, message: "Access denied, only users allowed" });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export default checkPriviledge;
