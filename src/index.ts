import { bootstrap } from "./app.controller";

bootstrap().catch((error: unknown) => {
  console.log("Failed to start server: ", error);
  process.exit(1);
});
