const User = require("../models/user");

//signupform
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      //due to this after sign up user will be automatically log in and it's info is save in session
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    //one case : when already sign in user will  sign up
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//login
module.exports.login = async (req, res) => {
  req.flash("success", "welcome to wanderlust ! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings"; //so that if user directly log in it will be directed to /listings
  res.redirect(redirectUrl); //redirect to the path where user want to go before loging in
};

//logout
module.exports.logout = (req, res) => {
  req.logout((err) => {
    //passport method to delete user info from ongoing session
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out now");
    res.redirect("/listings");
  });
};
