import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import writerRouter from "./routes/writer.routes";
import bookRouter from "./routes/book.routes";
import { AppDataSource } from "./config/database";

const app = express();

// Configuración de CORS
app.use(cors({
    origin: ['https://vue-frontend-kappa.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
// app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));
app.use("/writers", writerRouter);
app.use("/books", bookRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
    .then(() => app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)))
    .catch(err => { console.error("DB init error:", err); process.exit(1); });