import type { CallbackError } from "mongoose";
import User, { IUser } from "../models/user.model.js";
import mongoose from "mongoose";

describe("User Model Unit Tests:", () => {
  let user1: IUser, user2: IUser;
  beforeAll(async () => {
    const url = process.env.MONGO_URL;
    if (!url) process.exit(1);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    user1 = {
      email: "test@test.com",
      password: "M3@n.jsI$Aw3$0m3",
    };
    // user2 is a clone of user1
    user2 = user1;
  });

  afterAll(async () => {
    await User.deleteMany({}).exec();
    await mongoose.connection.close();
  });

  describe("Method Save", () => {
    it("should begin with no users", (done) => {
      User.find({}).exec((_, users) => {
        expect(users.length).toEqual(0);
        done();
      });
    });

    it("should be able to save without problems", (done) => {
      const _user1 = new User(user1);

      _user1.save((err) => {
        expect(err).toBeNull();
        User.deleteOne({ email: user1.email }, (err: CallbackError) => {
          expect(err).toBeNull();
          done();
        });
      });
    });

    it("should fail to save an existing user again", (done) => {
      var _user1 = new User(user1);
      var _user2 = new User(user2);

      _user1.save(() => {
        _user2.save((err) => {
          expect(err).toBeDefined();
          User.deleteOne({ email: user1.email }, (err: CallbackError) => {
            expect(err).toBeNull();
            done();
          });
        });
      });
    });
  });
});
