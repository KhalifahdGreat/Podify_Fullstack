import { CreateUser } from "#/@types/user";
import { VerifyEmailRequest } from "#/@types/user";

import { RequestHandler } from "express";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { PASSWORD_RESET_LINK } from "#/utils/variables";
import { SendVerificationMail } from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
//create User

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  //send verification email
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  SendVerificationMail(token, { name, email, userId: user.id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

// verify Email using token

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({
      error: "Invalid token!",
    });

  const matched = await verificationToken.compareToken(token);
  if (!matched)
    return res.status(403).json({
      error: "Invalid token!",
    });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
  res.json({ message: "your email is verified!" });
};

// Send re-verification Token

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "  Invalid Request" });

  if (!user) return res.status(403).json({ error: "  Invalid Request" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  SendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user.id.toString(),
  });

  res.json({ message: "Please check your mail!" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json(404).json({ error: "Account not Found" });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
  res.json({ resetLink });
};
