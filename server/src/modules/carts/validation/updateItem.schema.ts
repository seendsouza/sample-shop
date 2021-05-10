export default {
  $id: "https://sampleshop.com/update_item.json",
  type: "object",
  properties: {
    old_qty: { type: "integer" },
    new_qty: { type: "integer" },
  },
  required: ["old_qty", "new_qty"],
};
