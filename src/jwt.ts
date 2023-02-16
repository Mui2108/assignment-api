import { Response, NextFunction } from "express";
import { encode, decode } from "jwt-simple";
const secret =
  "637c1d3a5ddb736d63dec897804f279dfee7377d4dcc343d0893a4ceec53515d";
const algorithm = "HS256";

export const encodeJWT = (payload: any) => {
  const res = encode(payload, secret, algorithm);
  return res;
};

export const decodeJWT = (token: string) => {
  try {
    const res = decode(token, secret, false, algorithm);
    if (res) return true;
  } catch (error) {
    return false;
  }
};

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.query.token = bearerToken;
    if (decodeJWT(bearerToken)) next();
    else {
      res.status(403);
      res.send({ code: res.statusCode, message: "Please login." });
    }
  } else {
    res.status(403);
    res.send({ code: res.statusCode, message: "Please login." });
  }
};
