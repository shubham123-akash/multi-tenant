import Tenant from "../models/tenant.model.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { createActivityLog } from "../utils/createActivityLog.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  accessTokenCookieOptions,
  refreshTokenCookieOptions
} from "../utils/generateTokens.js";

// register
export const Register = async(req, res) => {
  try {
    const {name, email, password, companyName} = req.body;

    if(!name || !email || !password || !companyName){
      return res.status(400).json({
        message: "All fields are required",
        success: false
      })
    }

    if(password.length < 6){
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      })
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const tenant = await Tenant.create({
      name: companyName
    })

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tenantId: tenant._id,
      role: "OWNER"
    })

    return res.status(201).json({
      message: "Tenant registered successfully",
      success: true
    })

  } catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }}


// login
export const Login = async(req, res) => {
  try {

    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        message: "All fields are required",
        success: false
      })
    }

    // const user = await User.findOne({email, tenantId});
    const user = await User.findOne({email});
    if(!user || !user.isActive){
      return res.status(401).json({
        message: "Invalid credentials",
        success: false
      })
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({
          message: "Invalid credentials",
          success: false
        })
    }
    const tokenData = {
      userId: user._id,
      tenantId: user.tenantId,
      role: user.role
    }

    const accessToken = generateAccessToken(tokenData);
    const refreshToken = generateRefreshToken({ userId: user._id });

    // persist a hash of the refresh token so it can be verified & revoked later
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return res.status(200)
      .cookie("token", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json({
        message: "Login successfully",
        success: true
      })
        
    } catch(error){
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}


// logout

export const Logout = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
      try {
        const decoded = verifyRefreshToken(incomingRefreshToken);
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
      } catch (error) {
        // token already invalid/expired - nothing to revoke, just clear cookies
      }
    }

    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/api/v1/users"
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


// create users in tenant
export const createUser = async (req, res) => {
  try {
    
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        message: "Unauthorized User"
      });
    }

    const { name, email, password, role } = req.body;

    if(!name || !email || !password || !role){
      return res.status(400).json({
        message: "All fields are required",
        success: false
      })
    }

    if(password.length < 6){
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      })
    }

    const allowedRoles = ["ADMIN", "MEMBER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const existingUser = await User.findOne({
      email,
      tenantId: req.user.tenantId
    });

    if(existingUser){
      return res.status(401).json({
          message: "User already exist",
          success: false
      })
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      tenantId: req.user.tenantId 
    });

    await createActivityLog({
      action: "USER_CREATED",
      entityType: "USER",
      entityId: user._id,
      performedBy: req.user.userId,
      tenantId: req.user.tenantId
    });


    return res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
      error
    });
  }
}






// Get Logged In User
export const getMe = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    const user = await User.findById(req.user.userId).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
      success: false
    });
  }
};





// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Refresh token missing, please login again",
        success: false
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token, please login again",
        success: false
      });
    }

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || !user.isActive || !user.refreshToken) {
      return res.status(401).json({
        message: "Invalid or expired refresh token, please login again",
        success: false
      });
    }

    const isValidRefreshToken = await bcryptjs.compare(incomingRefreshToken, user.refreshToken);

    if (!isValidRefreshToken) {
      // token doesn't match what's stored - possible reuse/theft, revoke it
      user.refreshToken = null;
      await user.save();

      return res.status(401).json({
        message: "Invalid or expired refresh token, please login again",
        success: false
      });
    }

    const tokenData = {
      userId: user._id,
      tenantId: user.tenantId,
      role: user.role
    };

    const newAccessToken = generateAccessToken(tokenData);
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    // rotate the refresh token so a stolen one can't be reused indefinitely
    user.refreshToken = await bcryptjs.hash(newRefreshToken, 10);
    await user.save();

    return res.status(200)
      .cookie("token", newAccessToken, accessTokenCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
      .json({
        message: "Access token refreshed successfully",
        success: true
      });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


// Get All Users in Tenant
export const getUsers = async (req, res) => {
  try {

    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    const users = await User.find({
      tenantId: req.user.tenantId
    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch users",
      success: false
    });
  }
};