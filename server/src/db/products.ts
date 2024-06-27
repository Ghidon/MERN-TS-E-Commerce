import mongoose from "mongoose";

// Product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String] },
  categories: { type: [String] },
  tags: { type: [String] },
  sku: { type: String },
  stock: { type: Number },
  weight: { type: Number },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  lastUpdate: {
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  published: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

export const ProductModel = mongoose.model("Product", ProductSchema);

// Product Actions
export const getProducts = () => ProductModel.find();
export const getProductById = (id: string) => ProductModel.findById(id);
export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject());
export const deleteProductById = (id: string) =>
  ProductModel.findOneAndDelete({ _id: id });
// export const updateProductById = (id: string, values: Record<string, any>) =>
//   ProductModel.findByIdAndUpdate(id, values);
export const getProductsByCategory = (category: string) =>
  ProductModel.find({ categories: category });
export const getProductsByTag = (tag: string) =>
  ProductModel.find({ tags: tag });
