import express from "express";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import joinRequestRoutes from "./routes/joinRequest.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/group", groupRoutes);
app.use("/api/v1/joinRequest", joinRequestRoutes);

app.use(ErrorHandler);

export default app;