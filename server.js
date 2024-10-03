const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { engine } = require("express-handlebars");

const db = new sqlite3.Database("audi.sqlite3.db");

const port = 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/stock", (req, res) => {
  res.render("stock");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/listvehicles", (req, res) => {
  db.all("SELECT * FROM Vehicle", (error, vehicles) => {
    if (error) {
      res.send("Something went wrong...");
    } else {
      HTMLcode = '<table border="1px">';
      vehicles.forEach((oneVehicle) => {
        HTMLcode += "<tr>";
        HTMLcode += `<td>${oneVehicle.reg_plate}</td>`;
        HTMLcode += `<td>${oneVehicle.make}</td>`;
        HTMLcode += `<td>${oneVehicle.model}</td>`;
        HTMLcode += `<td>${oneVehicle.prod_year}</td>`;
        HTMLcode += `<td>${oneVehicle.kilometers}</td>`;
        HTMLcode += `<td>${oneVehicle.emp_id}</td>`;
        HTMLcode += `<td>${oneVehicle.facility_id}</td>`;
        HTMLcode += "/tr";
      });
      HTMLcode += "</table>";
      res.send(HTMLcode);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
