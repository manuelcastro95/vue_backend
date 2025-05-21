import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import writerRouter from "./routes/writer.routes";
import bookRouter from "./routes/book.routes";
import { AppDataSource } from "./config/database";
import fs from 'fs';
import path from 'path';

const srcPath = path.join(__dirname, 'db.sqlite'); // Ajusta la ruta si tu archivo está en otro lugar
const destPath = '/tmp/db.sqlite';

if (!fs.existsSync(destPath)) {
  fs.copyFileSync(srcPath, destPath);
}



const app = express();
app.use(express.json());
// app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));
app.use("/writers", writerRouter);
app.use("/books", bookRouter);

// app.use((req: Request, res: Response) => res.status(404).json({
//     message: "NotFound"
// }));


app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
    .then(() => app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)))
    .catch(err => { console.error("DB init error:", err); process.exit(1); });