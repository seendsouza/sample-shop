import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import User from "../models/user.model.js";

const secret = process.env.JWT_SECRET;

export const signUp = async (req: Request, res: Response) => {
  await User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return console.error(err);
    if (user) return console.log({ message: "User already exists." });
  }).exec();
  await User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  res.json({ message: "Signed up!" });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal error please try again" });
    } else if (!user) {
      res.status(401).json({ error: "Incorrect email or password" });
    } else {
      user.isCorrectPassword(password, function (err: Error, same: boolean) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal error please try again" });
        } else if (!same) {
          res.status(401).json({ error: "Incorrect email or password" });
        } else if (secret == null) {
          res.status(500).json({ error: "Missing secret" });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, { expiresIn: "1h" });
          res
            .cookie("token", token, { httpOnly: true })

            .sendStatus(200);
        }
      });
    }
  });
};

export const checkToken = (_: Request, res: Response) => {
  res.sendStatus(200);
};

export default { signUp, login, checkToken };
