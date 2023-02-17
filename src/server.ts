import express from "express";
import { Query } from "express-serve-static-core";
import { compare } from "bcrypt";
import bodyParser from "body-parser";

import { encodeJWT, verifyToken } from "./jwt";
import { users } from "./data/user";
import { organization, timelimeStatus } from "./data/organization";
import { temperatureDay } from "./data/weather";

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", verifyToken, (req, res) => {
  res.json({ result: "server run." });
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const userLogin = users.find((item) => item.username === username);
  if (userLogin) {
    compare(password, userLogin.password, (_err, result) => {
      if (result) {
        res.status(200);
        res.send({
          code: res.statusCode,
          userInfo: { ...userLogin, password: undefined },
          accessToken: encodeJWT({ ...userLogin, password: undefined }),
        });
      } else {
        res.status(401);
        res.send({ code: res.statusCode, message: "Login failed" });
      }
    });
  }
});

app.get("/organization", (_req, res) => {
  res.json({ code: res.statusCode, result: organization });
});

app.get("")

app.get("/timeline",verifyToken, (_req, res) => {
  res.json({ code: res.statusCode, result: timelimeStatus });
});

app.get("/temperature-tody",verifyToken, (_req, res) => {
  res.json({ code: res.statusCode, result: temperatureDay });
})



app.listen(3000, () => console.log("Server is running..."));
