import mongoose from "mongoose";
export const connect = () => {
  // DB Config
  let db: string | undefined;
  if (process.env.NODE_ENV === "production") {
    db =
      "mongodb://" +
      process.env.EXHIBITION_001_MONGO_SERVICE_SERVICE_HOST +
      ":27017/exhibition-001-k8s";
  } else if (process.env.NODE_ENV === "test") {
    db = process.env.MONGO_URL;
  } else {
    db = process.env.MONGO_URI;
  }
  if (db === undefined) {
    console.error("DB is null");
    return;
  }

  //Connect to Mongo
  return mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.error(err));
};

export default { connect };
