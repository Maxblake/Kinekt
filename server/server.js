const express = require("express");
const connectDB = require("../config/db");
const ioServer = require("./ioServer");

const app = express();

// Attach IO Server
const server = ioServer(app);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.status(200).send("Kinekt API Running"));

// Define Routes
app.use("/api/user", require("../routes/api/user"));
app.use("/api/auth", require("../routes/api/auth"));
app.use("/api/group", require("../routes/api/group"));
app.use("/api/group-type", require("../routes/api/groupType"));
app.use("/api/admin", require("../routes/api/admin"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));