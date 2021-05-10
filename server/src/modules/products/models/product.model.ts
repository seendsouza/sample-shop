import mongoose, { Document, Types } from "mongoose";
const Schema = mongoose.Schema;

export interface ICarted {
  cart_id: string;
  qty: number;
  timestamp: Date;
}

export interface IProduct {
  name: string;
  qty: number;
  timestamp: Date;
  item_details: Map<any, any>;
  carted: Array<ICarted>;
}

export interface CartedDocument extends ICarted, Document {}

export interface ProductDocument extends IProduct, Document {
  item_details: Types.Map<any>;
  carted: Types.Array<CartedDocument>;
}

const Carted = new Schema<CartedDocument>({
  cart_id: { type: String, required: true },
  qty: { type: Number },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create Schema
const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  qty: { type: Number, default: 0 },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  item_details: { type: Map, default: {} },
  carted: [Carted],
});

export default mongoose.model<ProductDocument>("inventory", ProductSchema);
