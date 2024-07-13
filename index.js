const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const routes = require("./routes");
const app = express();
const port = 3000;

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
