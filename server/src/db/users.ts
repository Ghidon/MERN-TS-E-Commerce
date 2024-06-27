import mongoose from "mongoose";

// User Config
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  displayName: {
    type: String,
    default: function () {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  avatar: { type: String },
  googleId: { type: String },
  googleLogin: { type: Boolean, default: false },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  phoneNumber: { type: String },
  authentication: {
    password: {
      type: String,
      required: function () {
        return !this.googleLogin;
      },
      select: false,
    },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  orders: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId },
      products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId },
          name: { type: String },
          price: { type: Number },
          quantity: { type: Number },
        },
      ],
      totalPrice: { type: Number },
      shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  wishlist: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
      price: { type: Number },
      image: { type: String },
    },
  ],
});

export const UserModel = mongoose.model("User", UserSchema);

// User Actions
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
