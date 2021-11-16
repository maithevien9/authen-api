import { Document, Schema, model } from 'mongoose';

import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      min: 6,
    },
  },
  { timestamps: true },
);

const User = model<IUser>('User', UserSchema);
export default User;
