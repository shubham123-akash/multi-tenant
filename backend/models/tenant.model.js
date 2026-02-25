import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true
    }

}, { timestamps: true });

const Tenant = mongoose.model("Tenant", tenantSchema);  // Tenanat
export default Tenant;
