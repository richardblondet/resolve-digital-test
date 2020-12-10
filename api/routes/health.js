"use strict";

const pjson = require("../package");
const UserModel = require("../models/users");

const alive = {
  "alive": true,
  "name": pjson.name,
  "version": pjson.version
};

module.exports = function (app) {
  app.post("/alive", async (req, res) => {
    await res.status(200).send(alive);
  });

  app.get("/alive", async (req, res) => {
    await res.status(200).send(alive);
  });

  app.get("/health", async (req, res) => {
    await res.status(200).send(alive);
  });

  app.post("/health", async (req, res) => {
    await res.status(200).send(alive);
  });

  app.get("/health/db", async (req, res) => {
    try {
      let obj = {
        email: "test@test.test",
        name:  "Richard",
      };

      let insertedObj = new UserModel(obj);
      await insertedObj.save();
      await UserModel.deleteOne({_id: insertedObj._id});

      res.status(200).send({ alive, insertedObj });
    } catch (err){
      res.status(500).send(err);
      throw new Error(err);
    }
  });

};
