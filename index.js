const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const script = require("./script.js");

app.get("/getData", async (req, res) => {
  const data = script.main().then((data, err) => {
    if (err) {
      res.status(500).send(err);
    }
    //send data json format
    //send data json format
    res.status(200).json(data);
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
