import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/256/5989/5989400.png",
    },
    saved: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Listing",
        },
      ],
      default: [],
    },

    listings: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Listing",
        },
      ],
    },
  },
  { timestamps: true }
);

// Pre-save hook for password hashing (CodeCraft pattern)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// Instance methods (CodeCraft pattern)
userSchema.methods = {
  isPasswordCorrect: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  generateAccessToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "7d",
      }
    );
  },
};

const User = mongoose.model("User", userSchema);

export { User };
export default User;
