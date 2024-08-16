// interface (typescript)
import { hash, compare, hashSync } from "bcrypt";
import { Model, model, ObjectId, Schema } from "mongoose";

//interface typescript

interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

//user schema to define user model

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, //email needs to be unique
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "Audio",
    },
    followers: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "User",
    },
    followings: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "User",
    },
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //hash
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }

  //save
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
