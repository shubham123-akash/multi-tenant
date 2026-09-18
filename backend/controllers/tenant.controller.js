import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";
import { getCache, setCache } from "../utils/cache.js";

const tenantInfoKey = (tenantId) => `tenant:info:${tenantId}`;

// get information about the tenant
export const getTenantInformation = async (req, res) => {
  try {

    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const cacheKey = tenantInfoKey(req.user.tenantId);

    const cached = await getCache(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const tenant = await Tenant.findById(req.user.tenantId);

    if (!tenant || !tenant.isActive) {
      return res.status(403).json({
        message: "Tenant is inactive"
      });
    }

    // Tenant info almost never changes and there's no update-tenant route
    // yet, so a longer TTL is fine here (no explicit invalidation trigger).
    await setCache(cacheKey, tenant, 600);

    res.json(tenant);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};



// get all tenants
// export const getAllTenants = async (req, res) => {
//   try {

//     const tenants = await Tenant.find().sort({ createdAt: -1 });

//     res.status(200).json(tenants);

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch tenants"
//     });
//   }
// };