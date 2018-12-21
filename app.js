const Class = require("./index");
const fs = require("fs");
let obj = new Class();

let FileData = fs.readFileSync("./2.txt").toString();
fs.writeFileSync('./data.json', JSON.stringify(obj.convertFileDataToRulesData(FileData)));

obj = new Class(require('./data.json'));
console.log(
  obj.isUrlAds("https://c.amazon-adsystem.com/aax2/apstag.js")
);
