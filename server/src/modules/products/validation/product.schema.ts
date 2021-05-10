export default {
  $id: "https://sampleshop.com/product.json",
  type: "object",
  properties: {
    name: { type: "string" },
    qty: { type: "integer" },
    price: { type: "number" },
    image: { type: "string" },
    description: { type: "string" },
  },
  required: ["name", "qty", "price", "image", "description"],
};
