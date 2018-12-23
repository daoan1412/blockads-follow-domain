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
        return line.replace("\r", "").replace("\\5f ", "5f");
      } else {
        return line.replace("\\5f ", "5f");
      }
    });
    return lines;
  }

  convertRulesDataToDomainCssRules(rulesArray) {
    return rulesArray
      .map(rule => {
        try {
          new CssFilterRule(rule, 2);
          return rule;
        } catch (error) {}
      })
      .filter(rule => {
        if (!!rule && !/^##.+/g.test(rule)) {
          return rule;
        }
      });
  }

  convertRulesDataToCommonCssRules(rulesArray) {
    return rulesArray
      .map(rule => {
        if (/^##.+/g.test(rule)) {
          return rule;
        }
      })
      .filter(rule => {
        if (!!rule) {
          return rule;
        }
      });
  }
}

module.exports = BlockAds;
