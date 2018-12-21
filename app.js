const Class = require("./index");
const fs = require("fs");
let obj = new Class();
const SafariContentBlockerConverter = require("./filter/rules/converter");

// let FileData = fs.readFileSync("./easylist.txt").toString();
// fs.writeFileSync('./data.json', JSON.stringify(obj.convertFileDataToRulesData(FileData)));

// obj = new Class(require('./data.json'));
// console.log(
//   obj.isUrlAds("https://amd-ssl.cdn.turner.com/cnn/big/ads/2018/07/13/KoreanAirGlobal_30s_EN_v2_576x324.mp4")
// );
const safariJSON = SafariContentBlockerConverter.convertArray(
  require("./data.json"),
  50000,
  true
);
if (safariJSON.converted.length > 0) {
  fs.writeFileSync(
    "./adaway.json",

    safariJSON.converted.replace(/(\t|\n|)/gm, "")
  );
  console.log("=====");
}
