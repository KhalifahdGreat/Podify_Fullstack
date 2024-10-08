import * as yup from "yup";
import { isValidObjectId } from "mongoose";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Naming is missing")
    .min(3, "Naming is too short")
    .max(20, "Name is too long"),

  email: yup.string().email("Invalid email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password is too simple"
    ),
});

export const EmailVerificationBody = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId"),
});
