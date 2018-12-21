const utils = require("../../utils");
const FilterRule = require("./base-filter-rule");
const UrlFilterRule = require("./url-filter-rule");
const { ContentFilterRule } = require("./content-filter-rule");
const CssFilterRule = require("./css-filter-rule");
const ScriptFilterRule = require('./script-filter-rule');

var createRule = function(ruleText, filterId) {
  ruleText = ruleText ? ruleText.trim() : null;
  if (!ruleText) {
    return null;
  }
  var rule = null;
  try {
    var StringUtils = utils.strings;

    if (
      StringUtils.startWith(ruleText, FilterRule.COMMENT) ||
      StringUtils.contains(ruleText, FilterRule.OLD_INJECT_RULES) ||
      StringUtils.contains(ruleText, FilterRule.MASK_JS_RULE)
    ) {
      // Empty or comment, ignore
      // Content rules are not supported
      return null;
    }

    if (StringUtils.startWith(ruleText, FilterRule.MASK_WHITE_LIST)) {
      return new UrlFilterRule(ruleText, filterId);
    }

    if (
      FilterRule.findRuleMarker(
        ruleText,
        ContentFilterRule.RULE_MARKERS,
        ContentFilterRule.RULE_MARKER_FIRST_CHAR
      )
    ) {
      var responseContentFilteringSupported = true;
      if (!responseContentFilteringSupported) {
        return null;
      }
      return new ContentFilterRule(ruleText, filterId);
    }

    if (
      FilterRule.findRuleMarker(
        ruleText,
        CssFilterRule.RULE_MARKERS,
        CssFilterRule.RULE_MARKER_FIRST_CHAR
      )
    ) {
      return new CssFilterRule(ruleText, filterId);
    }

    if (
      FilterRule.findRuleMarker(
        ruleText,
        ScriptFilterRule.RULE_MARKERS,
        ScriptFilterRule.RULE_MARKER_FIRST_CHAR
      )
    ) {
      return new ScriptFilterRule(ruleText, filterId);
    }

    return new UrlFilterRule(ruleText, filterId);
  } catch (ex) {
    console.warn(
      "Cannot create rule from filter {0}: {1}, cause {2}",
      filterId || 0,
      ruleText,
      ex
    );
  }

  return null;
};

module.exports = createRule;