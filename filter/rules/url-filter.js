const UrlFilterRuleLookupTable = require('./url-filter-lookup-table');

var UrlFilter = function (rules) {

    this.basicRulesTable = new UrlFilterRuleLookupTable();
    this.importantRulesTable = new UrlFilterRuleLookupTable();

    if (rules) {
        for (var i = 0; i < rules.length; i++) {
            this.addRule(rules[i]);
        }
    }
};

UrlFilter.prototype = {

    /**
     * Adds rule to UrlFilter
     *
     * @param rule Rule object
     */
    addRule: function (rule) {

        if (rule.isImportant) {
            this.importantRulesTable.addRule(rule);
        } else {
            this.basicRulesTable.addRule(rule);
        }
    },

    /**
     * Removes rule from UrlFilter
     *
     * @param rule Rule to remove
     */
    removeRule: function (rule) {

        if (rule.isImportant) {
            this.importantRulesTable.removeRule(rule);
        } else {
            this.basicRulesTable.removeRule(rule);
        }
    },

    /**
     * Removes all rules from UrlFilter
     */
    clearRules: function () {
        this.basicRulesTable.clearRules();
        this.importantRulesTable.clearRules();
    },

    /**
     * Searches for first rule matching specified request
     *
     * @param url           Request url
     * @param documentHost  Document host
     * @param requestType   Request content type (UrlFilterRule.contentTypes)
     * @param thirdParty    true if request is third-party
     * @param skipGenericRules    skip generic rules
     * @return matching rule or null if no match found
     */
    isFiltered: function (url, documentHost, requestType, thirdParty, skipGenericRules) {
        // First looking for the rule marked with $important modifier
        var rule = this.importantRulesTable.findRule(url, documentHost, thirdParty, requestType, !skipGenericRules);
        if (!rule) {
            rule = this.basicRulesTable.findRule(url, documentHost, thirdParty, requestType, !skipGenericRules);
        }
        return rule;
    },

    /**
     * Returns the array of loaded rules
     */
    getRules: function () {
        var rules = this.basicRulesTable.getRules();
        return rules.concat(this.importantRulesTable.getRules());
    }
};

module.exports = UrlFilter;