const express = require("express");

const app = express();

app.use("/public", express.static('public'));

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("Server working on port " + PORT));