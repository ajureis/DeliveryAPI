import express from "express"
import winston from "winston"
import pedidosRouter from "./routes/pedido.routes.js"
import { promises as fs } from "fs"
import cors from "cors"

const { readFile, writeFile} = fs;

global.fileName = "pedidos.json";

// não precisa decorar isso
// pode ser utilizados em outros projetos
const { combine, timestamp, label, printf} = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} ${message}`
})

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: "pedidos-api.log"})
  ],
  format: combine (
    label({ label: "pedidos-api" }),
    timestamp(),
    myFormat
  )
})



const app = express();
app.use(express.json());
app.use(cors());
app.use("/pedido", pedidosRouter)

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info("API Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      pedidos: []
    }
    writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {

      logger.info("API Started! and File Created!");
    }).catch (err => {
      logger.error(err);
    })
  }
})