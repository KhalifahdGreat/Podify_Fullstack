import { create } from "#/controller/user";
import { verifyEmail } from "#/controller/user";
import { validate } from "#/middleware/validator";
import { sendReVerificationToken } from "#/controller/user";
import { generateForgetPasswordLink } from "#/controller/user";

import {
  CreateUserSchema,
  EmailVerificationBody,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);

export default router;
