import mongoose, { Document, Types } from "mongoose";
const Schema = mongoose.Schema;

export interface ICartItem {
  name: string;
  qty: number;
  item_details: Map<any, any>;
}

export interface ICart {
  last_modified: Date;
  status: string;
  items: Array<ICartItem>;
}

export interface CartItemDocument extends ICartItem, Document {
  item_details: Types.Map<any>;
}

export interface CartDocument extends ICart, Document {
  items: Types.Array<CartItemDocument>;
}

const CartItemSchema = new Schema<CartItemDocument>({
  name: { type: String },
  qty: { type: Number },
  item_details: { type: Map },
});
// Create Schema
const CartSchema = new Schema<CartDocument>({
  last_modified: { type: Date, default: Date.now },
  status: { type: String, default: "active" },
  items: [CartItemSchema],
});

export default mongoose.model<CartDocument>("cart", CartSchema);
