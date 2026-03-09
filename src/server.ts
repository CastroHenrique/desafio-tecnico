import { Server } from "node:http";
import dotenv from "dotenv";
import { app } from "./app";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const server = new Server(app);

const port = process.env.SERVER_OUTPUT_PORT || 80;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { server };
