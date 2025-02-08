const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const pkg = require("./package.json");
const routes = require("./routes");
const apiRoutes = require("./routes/api");
const logger = require("./lib/logger");
const requestLogger = require("./middleware/requestLogger");
const app = express();
const port = 3000;

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(requestLogger);

app.use("/", routes);
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  logger.info(`✅ v${pkg.version} running on port ${port}`);
});
