const express = require("express");
const bodyParser = require("body-parser");
const { CarRental } = require("./rentalPrice");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/pictures", express.static("images"));

const formHtml = fs.readFileSync("form.html", "utf8");
const resultHtml = fs.readFileSync("result.html", "utf8");

app.post("/", (req, res) => {
  const post = req.body;
  let result = "";
  try {
    const startDate = new Date(post.pickupdate);
    const endDate = new Date(post.dropoffdate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    if (rentalDays <= 0) throw new Error("Invalid date range");

    const rental = new CarRental(
      Number(post.age),
      Number(post.licenseYears),
      String(post.type),
      rentalDays,
      String(post.pickupdate)
    );

    const price = rental.calculatePrice();
    result = resultHtml.replace("$0", price);
  } catch (error) {
    result = `<p style="color:red;">${error.message}</p>`;
  }
  res.send(formHtml + result);
});

app.get("/", (req, res) => {
  res.send(formHtml);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});