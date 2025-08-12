import express from "express";
import API_KEY from "./sources/keys.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from backend to frontend!");
});

app.post("/weather", async (req, res) => {
  try {
    const cityName = req.body.cityName;
    if (!cityName) {
      return res.status(400).send("City name is required");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      return res.status(404).json({ weatherText: "City is not found!" });
    }

    const temp = data.main.temp;
    return res.status(200).json({
      weatherText: `The temperature in ${cityName} is ${temp}°C`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.use((err, req, res, next) => {
  if (err) {
    return res
      .status(400)
      .send(
        "An error occurred while processing the data. Please check the entered data and try again"
      );
  }
  next();
});

export default app;
