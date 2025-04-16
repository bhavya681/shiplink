import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    secretData: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "Shipper"],
      default: "User",
    },
    bio: {
      type: String,
      required: true,
    },
    paymentLink: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);
export default User;

// import mongoose from "mongoose";

// const LocationSchema = new mongoose.Schema({
//   lat: {
//     type: Number,
//     required: true,
//   },
//   lon: {
//     type: Number,
//     required: true,
//   },
// });

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     profile: {
//       type: String,
//       required: true,
//     },
//     bio: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     location: {
//       type: LocationSchema,
//       required: true,
//     },
//     phone: {
//       type: Number,
//       required: true,
//     },
//     secretData: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["User", "Shipper"],
//       default: "User",
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", UserSchema);
// export default User;
