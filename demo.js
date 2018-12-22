const downloadFileSync = require("download-file-sync");
const adsClass = require("./index");
const adsInstance = new adsClass();
const fs = require("fs");

const baseUrl = "https://filters.adtidy.org/extension/chromium/filters/";
const adsList = ["2_optimized", "3", "4", "11", "12", "14"];
let content = "";

for (let file of adsList) {
  content += downloadFileSync(`${baseUrl}${file}.txt`) + "\n";
}

fs.writeFileSync(
  "./data.json",
  JSON.stringify(adsInstance.convertFileDataToRulesData(content))
);

obj = new adsClass(require("./data.json"));
console.log(
  obj.isUrlAds(
    "https://amd-ssl.cdn.turner.com/cnn/big/ads/2018/07/13/KoreanAirGlobal_30s_EN_v2_576x324.mp4"
  )
);

const contentBlocking = adsInstance.convertToContentBlocking(
  require("./data.json")
);
fs.writeFileSync("./adaway.json", contentBlocking);
