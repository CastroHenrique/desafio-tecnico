import { json as jsonParser } from "body-parser";
import cors from "cors";
import express from "express";
import propertiesRoutes from "./routes/properties";
import rentalProposalsRoutes from "./routes/rentalProposals";
import usersRoutes from "./routes/users";

const app = express();

app.use(cors());
app.use(
  jsonParser({
    limit: "100mb",
  }),
);

app.use([usersRoutes, propertiesRoutes, rentalProposalsRoutes]);

app.use("/", express.static("docs"));

export { app };
