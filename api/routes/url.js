"use strict";

const pjson = require("../package");
const got = require('got');
const { JSDOM } = require('jsdom');

const { encode } = require('../services/shortener');
const UrlModel = require("../models/url");

const alive = {
  "alive": true,
  "name": pjson.name,
  "version": pjson.version
};

module.exports = function (app) {
  app.get("/url", async (req, res) => {
    try {
      let response = {};

      // get 100 records and sort them DESC by timesAccessed
      const collection = await UrlModel.find({}, null, { 
        sort: { 'timesAccessed': -1 },
        limit: 100 
      });

      // format response
      response.status = 'success';
      response.data = collection;

      // return to user
      return await res.status(200).send(response);
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/url", async (req, res) => {
    try {
      let response = {};
      
      // getting the url from the request
      const { url } = req.body;
      const result = await got(url);
      const { window } = new JSDOM( result.body );
      
      // grab th title
      const title = window.document.title;
      
      // save to database
      let newRecord = new UrlModel({ url, title, timesAccessed: 0 });
      await newRecord.save();

      // save the code based on the id
      newRecord.code = encode(parseInt(newRecord._id.valueOf(), 16));
      await newRecord.save();
      
      // format response
      response.status = 'success';
      response.data = newRecord;
      
      // return to the user with a response
      return await res.status(200).send(response);
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/l/:code", async (req, res) => {
    try {
      // get in the collection the url by the code
      const { code } = req.params;
      
      // get the url from the result 
      const urlRecord = await UrlModel.findOne({ code });
      const { url, timesAccessed = 0 } = urlRecord;

      // console.log('url', url);

      // Increment counter of access times
      urlRecord.timesAccessed = timesAccessed + 1;
      await urlRecord.save();
      
      // redirect to the found url
      await res.redirect(url);
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/url/health", async (req, res) => {
    await res.status(200).send(alive);
  });
  

};
