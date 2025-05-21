import express from "express";
import { logout, register } from "../controllers/UserAPIs.js";
import passport from "passport";

const router = express.Router();

router.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.post("/register", (req, res) => {
  register(req, res);
});
/*router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    //console.log(req)
    login(req, res);
  }
);*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Invalid credentails" });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      res.json(user);
    });
  })(req, res, next);
});
router.get("/logout", (req, res) => {

  logout(req, res);
});

export { router };
