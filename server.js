const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const db = require("./models/index.js");
const apiRouter = require("./routes/apiRoutes.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', apiRouter);

//handelbars
const exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


db.sequelize.sync({}).then(
    app.listen(PORT, function(){
        console.log("listening on http://localhost:" + PORT);
    })
);