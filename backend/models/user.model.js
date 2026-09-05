import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique : true
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      default: "MEMBER"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // hashed refresh token, stored so it can be verified & revoked (rotation, logout, theft detection)
    refreshToken: {
      type: String,
      default: null,
      select: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;