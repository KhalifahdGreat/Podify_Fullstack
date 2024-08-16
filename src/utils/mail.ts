import EmailVerificationToken from "#/models/emailVerificationToken";
import { MAILTRAP_USER } from "#/utils/variables";
import { MAILTRAP_PASSWORD } from "#/utils/variables";
import { VERIFICATION_EMAIL } from "#/utils/variables";
import { generateTemplate } from "#/mail/template";
import nodemailer from "nodemailer";
import path from "path";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const SendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { name } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use tge given OTP to verify your email.`;

  transport.sendMail({
    to: VERIFICATION_EMAIL, // list of receivers
    subject: "Welcome", // Subject line
    html: generateTemplate({
      title: "Welcome to Podify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};
//token = 6 digit otp => add otp => send to my api
