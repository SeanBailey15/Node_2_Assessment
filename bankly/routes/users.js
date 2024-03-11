/** User related routes. */

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { authUser, requireLogin, requireAdmin } = require("../middleware/auth");

/** GET /
 *
 * Get list of users. Only logged-in users should be able to use this.
 *
 * It should return only *basic* info:
 *    {users: [{username, first_name, last_name}, ...]}
 *
 */

router.get("/", authUser, requireLogin, async function (req, res, next) {
  try {
    // BUG #3 FOUND: We are not returning the described information from the docstring
    let users = await User.getAll();
    return res.json({ users });

    // BUG #3 FIXED: See models/user.js @ getAll(). Returns basic info as described in docstring
  } catch (err) {
    return next(err);
  }
}); // end

/** GET /[username]
 *
 * Get details on a user. Only logged-in users should be able to use this.
 *
 * It should return:
 *     {user: {username, first_name, last_name, phone, email}}
 *
 * If user cannot be found, return a 404 err.
 *
 */

router.get(
  "/:username",
  authUser,
  requireLogin,
  async function (req, res, next) {
    try {
      let user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
); // end

/** PATCH /[username]
 *
 * Update user. Only the user themselves or any admin user can use this.
 *
 * It should accept:
 *  {first_name, last_name, phone, email}
 *
 * It should return:
 *  {user: all-data-about-user}
 *
 * If user cannot be found, return a 404 err. If they try to change
 * other fields (including non-existent ones), an error should be raised.
 *
 */

router.patch(
  "/:username",
  authUser,
  requireLogin,
  /* 
  BUG #5 FOUND: Using the requireAdmin middleware here prevents normal users
  from being able to access the route entirely. Logic within route changed instead.
  */
  // requireAdmin,
  /* 
  BUG #5 FIX: commented middleware out of function, changed logic for checking
  credentials within function below
  */

  async function (req, res, next) {
    try {
      // Previously, combined with requireAdmin, commented out condition below was the only check
      // if (!req.curr_admin && req.curr_username !== req.params.username) {
      //   throw new ExpressError("Only that user or admin can edit a user.", 401);
      // }

      // BUG #5 LOGIC FIXES:
      // If user is not self or admin
      if (!req.curr_admin && req.curr_username !== req.params.username) {
        throw new ExpressError("Only that user or admin can edit a user.", 401);
      }
      // If user is not admin, cannot change admin privilege
      else if (
        !req.curr_admin &&
        req.curr_username === req.params.username &&
        req.body.hasOwnProperty("admin")
      ) {
        throw new ExpressError(
          "Standard user cannot grant/revoke admin permissions",
          401
        );
      }
      // No credential will allow update to password, as this will overwrite
      // the hashed password in the database
      else if (
        !req.curr_admin &&
        req.curr_username === req.params.username &&
        req.body.hasOwnProperty("password")
      ) {
        throw new ExpressError("Password update not allowed", 401);
      } else if (req.curr_admin && req.body.hasOwnProperty("password")) {
        throw new ExpressError("Password update not allowed", 401);
      } else if (
        !req.curr_admin &&
        req.curr_username === req.params.username &&
        req.body.hasOwnProperty("username")
      ) {
        throw new ExpressError("Username update not allowed", 401);
      } else if (req.curr_admin && req.body.hasOwnProperty("username")) {
        throw new ExpressError("Username update not allowed", 401);
      }

      // get fields to change; remove token so we don't try to change it
      let fields = { ...req.body };
      delete fields._token;

      let user = await User.update(req.params.username, fields);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
); // end

/** DELETE /[username]
 *
 * Delete a user. Only an admin user should be able to use this.
 *
 * It should return:
 *   {message: "deleted"}
 *
 * If user cannot be found, return a 404 err.
 */

router.delete(
  "/:username",
  authUser,
  requireAdmin,
  async function (req, res, next) {
    try {
      User.delete(req.params.username);
      return res.json({ message: "deleted" });
    } catch (err) {
      return next(err);
    }
  }
); // end

module.exports = router;
