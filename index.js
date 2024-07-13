const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const pkg = require("./package.json");
const routes = require("./routes");
const logger = require("./lib/logger");
const app = express();
const port = 3000;

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use("/", routes);

app.listen(port, () => {
  logger.info(`✅ v${pkg.version} running on port ${port}`);
});
