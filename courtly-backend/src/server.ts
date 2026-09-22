import app from "./app";
import dotenv from "dotenv";
import logger from "./config/logger.config";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});