import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  email: string;
  password: string;
}

export interface UserDocument extends IUser, Document {
  isCorrectPassword(
    attemptedPassword: string,
    callback: (err: Error, success: boolean) => void
  ): void;
}

// Create Schema
const UserSchema = new Schema<UserDocument>({
  email: { type: String, unique: "Email already exists" },
  password: { type: String },
});

UserSchema.methods.isCorrectPassword = function (
  this: UserDocument,
  attemptedPassword: string,
  callback: (err: Error, success: boolean) => void
) {
  const { password } = this;
  bcrypt.compare(attemptedPassword, password, (err, success) => {
    if (err) {
      callback(err, false);
    } else {
      callback(err, success);
    }
  });
};

export default mongoose.model<UserDocument>("user", UserSchema);
