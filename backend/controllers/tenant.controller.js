import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";



// get information about the tenant
export const getTenantInformation = async (req, res) => {
  try {

    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const tenant = await Tenant.findById(req.user.tenantId);

    if (!tenant || !tenant.isActive) {
      return res.status(403).json({
        message: "Tenant is inactive"
      });
    }

    res.json(tenant);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};




// get all tenants
export const getAllTenants = async (req, res) => {
  try {

    const tenants = await Tenant.find().sort({ createdAt: -1 });

    res.status(200).json(tenants);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tenants"
    });
  }
};
