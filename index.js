const CssFilter = require("./filter/rules/css-filter");
const CssFilterRule = require("./filter/rules/css-filter-rule");
const UrlFilterRule = require("./filter/rules/url-filter-rule");
const UrlFilter = require("./filter/rules/url-filter");

class BlockAds {
  constructor(rulesArray = ["example.org,~subdomain.example.org##selector"]) {
    const cssRules = rulesArray
      .map(rule => {
        try {
          return new CssFilterRule(rule, 2);
        } catch (error) {}
      })
      .filter(el => {
        if (!!el) {
          return el;
        }
      });
    const urlRules = rulesArray
      .map(rule => {
        try {
          return new UrlFilterRule(rule);
        } catch (error) {}
      })
      .filter(el => {
        if (!!el) {
          return el;
        }
      });
    this.filterCss = new CssFilter(cssRules);
    this.filterUrl = new UrlFilter(urlRules);
    this.genericHide =
      CssFilter.RETRIEVE_TRADITIONAL_CSS +
      CssFilter.RETRIEVE_EXTCSS +
      CssFilter.GENERIC_HIDE_APPLIED;
  }

  getCssShouldBeHidden(domain) {
    return this.filterCss.buildCssHits(domain, this.genericHide);
  }

  isUrlAds(url) {
    // need improve in future.
    return !!this.filterUrl.isFiltered(url, "DOCUMENT", "OTHER", true, false);
  }

  convertFileDataToRulesData(dataWhenReadFile) {
    const lines = dataWhenReadFile.split("\n").map(line => {
      if (line.indexOf("\r") != -1) {
        return line.replace("\r", "");
      } else {
        return line;
      }
    });

    return lines;
  }
}

module.exports = BlockAds;
