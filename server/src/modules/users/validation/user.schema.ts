export default {
  $id: "https://sampleshop.com/user.json",
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
};
