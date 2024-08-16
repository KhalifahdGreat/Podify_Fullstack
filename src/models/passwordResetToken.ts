// interface (typescript)
import { Model, model, ObjectId, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

// interface typescript

interface passwordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

//compare function schema

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

//expire them after 1hr
const passwordTokenResetSchema = new Schema<
  passwordResetTokenDocument,
  {},
  Methods
>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

passwordTokenResetSchema.pre("save", async function (next) {
  //hash
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }

  //save
  next();
});

passwordTokenResetSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model("PasswordResetToken", passwordTokenResetSchema) as Model<
  passwordResetTokenDocument,
  {},
  Methods
>;
