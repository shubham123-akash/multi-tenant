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
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      default: "MEMBER"
    },

    isActive: {
      type: Boolean,
      default: true
    }
}, { timestamps: true });

// userSchema.index({ email: 1, tenantId: 1 }, { unique: true });


const User = mongoose.model("User", userSchema);
export default User;

