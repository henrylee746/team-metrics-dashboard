const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const submitRouter = require("./routes/submitRouter.js");
const json = require("./message.json");

app.use(
  cors({
    //necessary since frontend/backend are running on different ports
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
//application-level middleware for every incoming request
app.use(express.static("public"));
app.use(express.json()); //parses JSON data, making it available in req.body

app.use("/submit", submitRouter);

//Use as a 404 page
/*ownerRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
