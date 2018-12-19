# blockads-follow-domain

yarn add blockads-follow-domain 

Rules file from https://filters.adtidy.org/extension/chromium/filters/2.txt

convertFileDataToRulesData 

```javascript
var rulesData; // array of rules css
var adsBlocker = require('blockads-follow-domain');
var adsBlockerInstance = new adsBlocker(rulesData);
var css = adsBlockerInstance.getCssShouldBeHidden(domain);
```