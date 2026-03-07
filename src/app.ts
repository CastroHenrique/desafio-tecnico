import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";
import { json as jsonParser } from "body-parser";
import propertiesRoutes from "./routes/properties";

const app = express();

app.use(cors());
app.use(
    jsonParser({
    limit: "100mb"
    })
);

app.use([
    usersRoutes,
    propertiesRoutes,
]);

app.use("/", express.static("docs"));

export { app };

