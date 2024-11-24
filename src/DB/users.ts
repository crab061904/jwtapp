import mongoose, { Document, Types } from 'mongoose';

// Define the User interface with the _id field typed explicitly
export interface User extends Document {
  _id: Types.ObjectId; // Explicitly type _id
  username: string;
  email: string;
  role: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken?: string;
  };
}

// Define the schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' }, // Add role
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

// Define the model with the User interface
export const UserModel = mongoose.model<User>('User', UserSchema);

// Utility functions
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Partial<User>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Partial<User>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true });
