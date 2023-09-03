const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const script = require("./script.js");
app.get("/getData/:token/:appid", async (req, res) => {
  if (!req.params.token || !req.params.appid) {
    return res.status(400).send("Bad request");
  }
  const token = req.params.token.toString();
  const appid = req.params.appid.toString();
  try {
    const data = script
      .main(token, appid)
      .then((data, err) => {
        if (err) {
          if (res.status(400) || res.status(403)) {
            return res.status(400).send("Bad request");
          }
        }
        //send data json format
        //send data json format
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log("Error", err);
        res.status(400).send("Bad request");
      });
  } catch (e) {
    console.log("Error", e);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
