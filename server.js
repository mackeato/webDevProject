// Admin definition
const adminName = "JeromeCool1337";
//const adminPass = "supersecretpassword";
const adminPass =
  "$2b$12$1Vr6ShC8vsllXkMryDmnjOJdzF3M59dod9/Caf62Mb/loDrCT/ymu";

// Packages
const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const { engine } = require("express-handlebars");

const db = new sqlite3.Database("audi.sqlite3.db");

const port = 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// MIDDLEWARES
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// DATABASE
const dbFile = "my-project-data.sqlite3.db";
db2 = new sqlite3.Database(dbFile);

// SESSIONS
const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: "Th1s1sV3rySe(ret80085",
  })
);
app.use(function (req, res, next) {
  console.log("Session passed to response locals...");
  res.locals.session = req.session;
  next();
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    model = { error: "Username and password are required.", message: "" };
    return res.status(400).render("login.handlebars", model);
  }
  if (username == adminName) {
    console.log("Username has admin priviliges");
    /*  if (password == adminPass) {
      console.log("Password is correct for admin");

      const model = { error: "", message: `Welcome back, admin ${username}.` };

      res.render("login.handlebars", model);
    } else {
      const model = {
        error: "Invalid password, please try again.",
        message: "",
      };

      res.status(400).render("login.handlebars", model);
    } */
    bcrypt.compare(password, adminPass, (err, result) => {
      if (err) {
        const model = {
          error: "Error while comparing passwords" + err,
          message: "",
        };
        res.render("login.handlebars", model);
      }

      if (result) {
        console.log("Password is correct for admin.");
        // Save user-information into session
        req.session.isAdmin = true;
        req.session.isLoggedIn = true;
        req.session.name = username;
        console.log("Session information: " + JSON.stringify(req.session));

        res.redirect("/");
        //Message model
        /*         const model = { error: "", message: `Welcome back, admin ${username}` };
        res.render("login.handlebars", model); */
      } else {
        const model = {
          error: "Incorrect password, please try again.",
          message: "",
        };
        res.status(400).render("login.handlebars", model);
      }
    });
  } else {
    const model = { error: "Invalid username, please try again.", message: "" };

    res.status(400).render("login.handlebars", model);
  }
});

app.get("/", (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  console.log("Home model:" + JSON.stringify(model));
  res.render("home", model);
});

app.get("/stock", (req, res) => {
  db.all("SELECT * FROM Vehicle", (error, vehicles) => {
    if (error) {
      res.render("error", { message: "Something went wrong.." });
    } else {
      res.render("stock", { vehicles: vehicles });
    }
  });
});

app.get("/vehicle/:reg_plate", (req, res) => {
  console.log(
    "Vehicle route parameter reg_plate: " + JSON.stringify(req.params.reg_plate)
  );

  db.get(
    "SELECT * FROM Vehicle WHERE reg_plate=?",
    [req.params.reg_plate],
    (error, theVehicle) => {
      if (error) {
        console.log("Error", error);
        return res
          .status(500)
          .render("error", { message: "Failed to retrieve vehicle data." });
      } else {
        const model = {
          vehicle: theVehicle,
        };
        res.render("vehicle.handlebars", model);
      }
    }
  );
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error while destroying session", err);
    } else {
      console.log("Logged out.");
      res.redirect("/");
    }
  });
});

// CRUD
app.get("/vehicle/delete/:reg_plate", (req, res) => {
  console.log(
    "Vehicle route parameter registration plate: " +
      JSON.stringify(req.params.reg_plate)
  );
  db.run(
    "DELETE FROM Vehicle WHERE reg_plate=?",
    [req.params.reg_plate],
    (error, theVehicle) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log(
          "Vehicle " + req.params.reg_plate + " succesfully deleted."
        );
        res.redirect("/stock");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
