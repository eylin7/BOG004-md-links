#!/usr/bin/env node
const { getStats, broken } = require("./index.js");
const mdLinks= require("./md-links.js");
//const {resulPath} = require("./index.js");
const args = process.argv;
const options = {
  validate: false,
  stats: false,
};
const cli = () => {
  if (args.includes("--validate")) {
    options.validate = true;
  }
  if (args.includes("--stats")) {
    options.stats = true;
  }
  mdLinks(args[2], options)
    .then((respuesta) => {
      if (options.validate && options.stats) {
        console.table(broken(respuesta));
        console.table(getStats(respuesta));
      } else if (options.stats) {
        console.table(getStats(respuesta));
      } else if (options.validate) {
        console.log("RESPUESTA", respuesta);
      }
    })
    .catch((err) => console.log(err));
};
cli();









