
const FilterRule = require('./base-filter-rule')
const utils = require('../../utils/index')

function getScriptSource(filterId, ruleText) {
  return "remote";
}

/**
 * JS injection rule:
 * http://adguard.com/en/filterrules.html#javascriptInjection
 */
var ScriptFilterRule = function(rule, filterId) {
  FilterRule.call(this, rule, filterId);

  this.script = null;
  this.whiteListRule = utils.strings.contains(
    rule,
    FilterRule.MASK_SCRIPT_EXCEPTION_RULE
  );
  var mask = this.whiteListRule
    ? FilterRule.MASK_SCRIPT_EXCEPTION_RULE
    : FilterRule.MASK_SCRIPT_RULE;

  var indexOfMask = rule.indexOf(mask);
  if (indexOfMask > 0) {
    // domains are specified, parsing
    var domains = rule.substring(0, indexOfMask);
    this.loadDomains(domains);
  }

  this.script = rule.substring(indexOfMask + mask.length);

  this.scriptSource = getScriptSource(filterId, rule);
};

ScriptFilterRule.prototype = Object.create(FilterRule.prototype);

/**
 * All content rules markers start with this character
 */
ScriptFilterRule.RULE_MARKER_FIRST_CHAR = "#";

/**
 * Content rule markers
 */
ScriptFilterRule.RULE_MARKERS = [
  FilterRule.MASK_SCRIPT_EXCEPTION_RULE,
  FilterRule.MASK_SCRIPT_RULE
];

module.exports = ScriptFilterRule;
