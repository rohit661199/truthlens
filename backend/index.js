
import express from "express";






const app = express();
const port = process.env.PORT || 4000;









app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => console.log("Server started", port));
