const express = require("express");
const app = express();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("audi.sqlite3.db");

const port = 3000;

app.get("/", (req, res) => {
  res.send("deez nuts");
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
