const CssFilter = require("./filter/rules/css-filter");
const CssFilterRule = require("./filter/rules/css-filter-rule");

class BlockAds {
  constructor(rulesData) {
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
}

module.exports = BlockAds;
