const express = require("express");
const compression = require('compression')
const helmet = require('helmet')
const enforce = require("express-sslify");
const connectDB = require("../config/db");
const ioServer = require("./ioServer");
const path = require("path");

const app = express();

// Attach IO Server
const server = ioServer(app);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(compression());
app.use(helmet.frameguard())
app.use(helmet.xssFilter())

// Define Routes
app.use("/api/user", require("../routes/api/user"));
app.use("/api/auth", require("../routes/api/auth"));
app.use("/api/group", require("../routes/api/group"));
app.use("/api/group-type", require("../routes/api/groupType"));
app.use("/api/admin", require("../routes/api/admin"));

// Serve static assets in prod
if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));

  // Set static folder, cache static files 3 days
  app.use(express.static(path.resolve("client", "build"), { maxAge: 1000 * 60 * 60 * 24 * 3 }));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve("client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
