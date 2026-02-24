import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import librosRoutes from "./routes/libros.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import bibliotecarioRoutes from "./routes/bibliotecario.routes.js";
import devolucionesRoutes from "./routes/devoluciones.routes.js";
import adminLibrosRoutes from "./routes/admin.libros.routes.js";
import adminImportRoutes from "./routes/admin.import.routes.js";
import prestamosRoutes from "./routes/prestamos.routes.js";
import adminPortadasRoutes from "./routes/admin.portadas.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import passwordRoutes from "./routes/password.routes.js";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.json({ ok: true, name: "Biblioteca API" }));



// Usuario
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", passwordRoutes);

app.use("/api/libros", librosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api", prestamosRoutes);

app.use("/api/bibliotecario", bibliotecarioRoutes);


app.use("/api", devolucionesRoutes);
app.use("/api/admin/libros", adminLibrosRoutes);
app.use("/api/admin/import", adminImportRoutes);
app.use("/api/admin/libros", adminPortadasRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
