const express = require("express");
const bodyParser = require("body-parser");
const CarRental = require("./rentalPrice");
const fs = require("fs").promises; // Асинхронное чтение файлов

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/pictures", express.static("images"));

let formHtml = "";
let resultHtml = "";

// Загружаем HTML-шаблоны при старте сервера
async function loadTemplates() {
  try {
    formHtml = await fs.readFile("form.html", "utf8");
    resultHtml = await fs.readFile("result.html", "utf8");
  } catch (error) {
    console.error("Ошибка загрузки HTML-файлов:", error.message);
    process.exit(1); // Останавливаем сервер, если нет шаблонов
  }
}

app.post("/", async (req, res) => {
  const post = req.body;
  let result = "";

  try {
    const startDate = new Date(post.pickupdate);
    const endDate = new Date(post.dropoffdate);

    if (isNaN(startDate) || isNaN(endDate)) {
      throw new Error("Некорректная дата");
    }

    const timeDiff = endDate - startDate;
    const rentalDays = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const rental = new CarRental(
      Number(post.age),
      Number(post.licenseYears),
      String(post.type),
      rentalDays,
      String(post.pickupdate)
    );

    const price = rental.calculatePrice();
    result = resultHtml.replace(/\$0/g, price.toFixed(2)); // Подставляем цену
  } catch (error) {
    result = `<p style="color:red;">Ошибка: ${error.message}</p>`;
  }

  res.send(formHtml + result);
});

app.get("/", (req, res) => {
  res.send(formHtml);
});

// Запускаем сервер после загрузки шаблонов
loadTemplates().then(() => {
  app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`);
  });
});