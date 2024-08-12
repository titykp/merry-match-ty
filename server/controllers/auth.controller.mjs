// import bcrypt from "bcrypt";
import {
  signUp,
  signIn,
  refreshSession,
} from "../services/supabaseAuth.service.mjs";
import { getUser, createUser } from "../models/user.model.mjs";
import { cloudinaryUpload } from "../utils/cloudinary.uploader.mjs";
import { createProfile } from "../models/profile.model.mjs";
import { createAvatars, getAvatars } from "../models/profilePicture.model.mjs";
import { getRole } from "../models/role.model.mjs";
import jwt from "jsonwebtoken";

/**
 * Register User for the Merry Match application.
 *
 * @param {object} req - The request object, contain many key:value of form input. For example: username, email, password, avatar, hobbies[]
 * @param {object} res - The response object, used to send response back to the client If register is success or failure.
 * @returns
 */
export const registerUser = async (req, res) => {
  try {
    // console.log("Registering user with data:", req.body);

    // signUp via "Supabase Auth" service @/services/supabaseAuth.service.mjs
    await signUp(req.body);
    console.log("signUp with Supabase Auth success");

    // upload avatar to Cloudinary; then got avatar uri & url
    const avatarUri = await cloudinaryUpload(req.files);

    // `task:infoDB` register user information into our own database @/models/user.model.mjs
    const { user_id } = await createUser(req.body);
    await createProfile(user_id, req.body);
    await createAvatars(user_id, avatarUri);
    console.log("User registration completed");

    return res.status(201).json({
      message: `User has been created successfully`,
    });
  } catch (error) {
    console.error("Error occurred during user registration:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Login User for the Merry Match application.
 *
 * @param {object} req - The request object, contain key:value of usename and password.
 * @param {object} res - The response object, used to send response back to the client If login is success or failure.
 * @returns
 */
export const loginUser = async (req, res) => {
  try {
    const { session } = await signIn(req.body);
    console.log("get session from supabase auth");
    //get user data from database
    const userResult = await getUser(session.user.email);
    const userId = userResult.user_id;
    // get role name from database
    const { name } = await getRole(userId);
    // get avatars from database
    const avatars = await getAvatars(userId);
    const avatarsUrl = avatars.map((avatar) => avatar.url);

    const data = {
      id: userId,
      username: userResult.username,
      role: name,
      avatars: avatarsUrl,
    };
    // console.log("session", session);
    // console.log("session.access_token", session.access_token);
    // console.log("session.refresh_token", session.refresh_token);

    res.cookie("token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.cookie("refreshToken", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.status(200).json({ data, authenticated: true });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// /**
//  * Fetch User details (from table users, user_profiles, hobbies, avatars) from the Merry Match application.
//  *
//  * @param {object} req - The request object, contain jwt token.
//  * @param {object} res - The response object, used to send data (from table users, user_profiles, hobbies, profile_pictures) and response back to the client.
//  * @returns
//  */
// export const fetchUser = async (req, res) => {
//   try {
//     const jwtToken = req.cookie.token;

//     if (!jwtToken) {
//       return res.sendStatus(401); // Unauthorized if no token is present
//     }

//     console.log("jwtToken:", jwtToken);
//     const user = await getUser(jwtToken);

//     if (!user) {
//       console.error("No user is signed in");
//       return null;
//     }

//     console.log("Authenticated user:", user);
//     return user;
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, session = null) => {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(session);
    }
  });
  refreshQueue = [];
};

/**
 * Refreshes the user session.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The updated user session data.
 */
export const refreshUserSession = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid session data" });
  }

  if (typeof refreshToken !== "string") {
    console.error("Invalid refresh token format");
    return res.status(400).json({ message: "Invalid refresh token format" });
  }

  console.log("Old refreshToken is ", refreshToken);

  if (isRefreshing) {
    console.log("Refresh already in progress. Queuing this request.");
    return res
      .status(429)
      .json({ message: "Refresh in progress. Please wait." });
  }

  isRefreshing = true;
  let session;

  try {
    session = await attemptRefresh(refreshToken);

    if (!session) {
      console.warn("First refresh attempt failed, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
      session = await attemptRefresh(refreshToken);
    }

    if (!session) {
      throw new Error("Failed to refresh session after retry");
    }

    console.log("New refreshToken is ", session.refresh_token);

    console.log("get session from supabase auth (refresh session)");

    res.cookie("token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.cookie("refreshToken", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    console.log("Session refreshed successfully");

    return res
      .status(200)
      .json({ message: "Refresh Token Success", authenticated: true });
  } catch (error) {
    console.error("Error refreshing session:", error);

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return res.status(401).json({
      message: "Failed to refresh token, please log in again",
    });
  }
};

/**
 * Helper function to attempt token refresh
 * @param {string} refreshToken - The current refresh token
 * @returns {Promise<Object|null>} - The new session object or null if failed
 */
const attemptRefresh = async (refreshToken) => {
  try {
    const session = await refreshSession({ refresh_token: refreshToken });
    return session || null;
  } catch (error) {
    console.error("Error during refresh attempt:", error.message);
    return null;
  }
};

export const checkAuth = async (req, res) => {
  // console.log("req.cookies.token = ", req.cookies.token);
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Not authenticated" });
  }

  jwt.verify(token, process.env.SUPABASE_JWT_TOKEN, (err, user) => {
    if (err) {
      res.clearCookie("token");
      res.clearCookie("refreshToken");

      return res
        .status(401)
        .json({ authenticated: false, message: "Token invalid or expired" });
    }

    res.status(200).json({ authenticated: true, message: "Authenticated" });
  });
};
