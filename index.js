const CssFilter = require("./filter/rules/css-filter");
const CssFilterRule = require("./filter/rules/css-filter-rule");

class BlockAds {
  constructor(rulesData = ["example.org,~subdomain.example.org##selector"]) {
    const rules = rulesData.map(rule => new CssFilterRule(rule, 2));
    this.filter = new CssFilter(rules);
    this.genericHide =
      CssFilter.RETRIEVE_TRADITIONAL_CSS +
      CssFilter.RETRIEVE_EXTCSS +
      CssFilter.GENERIC_HIDE_APPLIED;
  }

  getCssShouldBeHidden(domain) {
    return this.filter.buildCssHits(domain, this.genericHide);
  }

  convertFileDataToRulesData(dataWhenReadFile) {
    const lines = dataWhenReadFile.split("\n");
    return lines.filter(line => {
      try {
        return new CssFilterRule(line, 2);
      } catch (error) {}
    });
  }
}

module.exports = BlockAds;
