import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      secretData,
      bio,
      phone,
      profile,
      location,
      role,paymentLink
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !phone ||
      !profile ||
      !role ||
      !secretData ||
      !bio ||
      !location 
    ) {
      return res
        .status(400)
        .json({ message: "All Fields are required", success: false });
    }
    if (!email.includes("@")) {
      return res
        .status(400)
        .json({ message: "Enter Valid Email Address", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please log in.",
        success: false,
      });
    }
    const hashword = await bcrypt.hash(password, 10);
    const user = await User({
      name,
      email,
      password: hashword,
      address,
      phone,
      profile,
      bio,
      location,
      secretData,
      role,
      paymentLink
    });

    const newUser = await user.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      newUser,
      token,
      message: "Successfully Register User",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// export const register = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       address,
//       phone,
//       profile,
//       bio,
//       secretData,
//       role,
//       location,
//     } = req.body;

//     // Validate all fields
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !address ||
//       !phone ||
//       !profile ||
//       !bio ||
//       !secretData ||
//       !role ||
//       !location?.lat ||
//       !location?.lon
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All fields are required", success: false });
//     }

//     if (!email.includes("@")) {
//       return res
//         .status(400)
//         .json({ message: "Enter a valid email address", success: false });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User already exists. Please log in.", success: false });
//     }

//     const hashword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashword,
//       address,
//       phone,
//       profile,
//       bio,
//       secretData,
//       role,
//       location,
//     });

//     await newUser.save();

//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(201).json({
//       message: "User registered successfully",
//       success: true,
//       token,
//       newUser,
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", success: false });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res
        .status(400)
        .json({ success: false, message: "Enter valid email address" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    } else {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials. Please try again.",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        token,
        message: "User successfully logged in.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const profile = async (req, res) => {
  try {
    const id = req.userId;
    const profileDetails = await User.findById(id).select("-password");
    if (!profileDetails) {
      return res
        .status(400)
        .json({ success: false, message: "no details found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully fetched", profileDetails });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const fetchUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await User.findById(id);
    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "no details found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully fetched", profile });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id } = await req.params;
    const { name, email, profile, phone, address, secretData, role ,bio,location,paymentLink} = req.body;
    if (
      !name ||
      !email ||
      !profile ||
      !phone ||
      !address ||
      !secretData ||
      !bio ||
      !role || !location 
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Fields Can't Be Empty" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, profile, phone, address, secretData, role ,bio,location,paymentLink},
      { new: true, runValidatores: true }
    );
    await updatedUser.save();
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Updation Failed" });
    }
    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, secretData } = req.body;

    if (!newPassword || !email || !secretData) {
      return res
        .status(400)
        .json({ success: false, message: "Fields Can't Be Empty" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.secretData !== secretData) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect secret data" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "Users Not Found" });
    }
    return res.status(200).json({ success: true, message: "fetch", users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
