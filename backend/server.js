const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./src/config/db");
const path = require("path");
const signatureRoutes = require("./src/routes/signatureRoutes");
dotenv.config();
connectDB();

const app = express();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));


app.get("/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));


app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/petitions", require("./src/routes/petitionRoutes"));
app.use("/api/signatures", require("./src/routes/signatureRoutes"));


const clientBuild = path.join(__dirname, "..", "client", "dist");
if (require("fs").existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get("*", (_req, res) => res.sendFile(path.join(clientBuild, "index.html")));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
