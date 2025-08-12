import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getPaymentLinkHandler, varifyPaymentHandeler } from "./controller.js";

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.get("/health", (req, res) => {
  res.send("Ok");
});

app.post("/get-payment-link", getPaymentLinkHandler);
app.get("/payment-confirmation", varifyPaymentHandeler);

app.listen(PORT, (er) => {
  if (er) console.log(er.message);
  else console.log(`Server started at PORT:${PORT}`);
});

export default app;
