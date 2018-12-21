const utils = require('../../utils/common')

var SHORTCUT_LENGTH = 6;
var ANY_HTTP_URL = "http:/";
var ANY_HTTPS_URL = "https:";

/**
 * Retrieves shortcut for rule
 * @param rule
 */
function getRuleShortcut(rule) {
  if (!rule.shortcut || rule.shortcut.length < SHORTCUT_LENGTH) {
    return null;
  }
  return rule.shortcut.substring(rule.shortcut.length - SHORTCUT_LENGTH);
}

/**
 * Special hash table that greatly increases speed of searching url filter rule by its shortcut
 */
var ShortcutsLookupTable = function(rules) {
  this.lookupTable = Object.create(null);

  if (rules) {
    for (var i = 0; i < rules.length; i++) {
      this.addRule(rules[i]);
    }
  }
};

ShortcutsLookupTable.prototype = {
  /**
   * Adds rule to shortcuts lookup table
   *
   * @param rule Rule to add to the table
   * @return boolean true if rule shortcut is applicable and rule was added
   */
  addRule: function(rule) {
    var shortcut = getRuleShortcut(rule);

    if (!shortcut || shortcut == ANY_HTTP_URL || shortcut == ANY_HTTPS_URL) {
      // Shortcut does not exists or it is too short
      return false;
    }

    if (!(shortcut in this.lookupTable)) {
      // Array is too "memory-hungry" so we try to store one rule instead
      this.lookupTable[shortcut] = rule;
    } else {
      var obj = this.lookupTable[shortcut];
      if (utils.collections.isArray(obj)) {
        // That is popular shortcut, more than one rule
        obj.push(rule);
      } else {
        this.lookupTable[shortcut] = [obj, rule];
      }
    }

    return true;
  },

  /**
   * Removes specified rule from the lookup table
   *
   * @param rule Rule to remove
   */
  removeRule: function(rule) {
    var shortcut = getRuleShortcut(rule);

    if (!shortcut) {
      // Shortcut does not exists or it is too short
      return;
    }

    if (shortcut in this.lookupTable) {
      var obj = this.lookupTable[shortcut];
      if (utils.collections.isArray(obj)) {
        utils.collections.removeRule(obj, rule);
        if (obj.length === 0) {
          delete this.lookupTable[shortcut];
        }
      } else {
        delete this.lookupTable[shortcut];
      }
    }
  },

  /**
   * Clears lookup table
   */
  clearRules: function() {
    this.lookupTable = Object.create(null);
  },

  /**
   * Searches for filter rules restricted to the specified url
   *
   * @param url url
   * @return List of filter rules or null if nothing found
   */
  lookupRules: function(url) {
    var result = null;
    for (var i = 0; i <= url.length - SHORTCUT_LENGTH; i++) {
      var hash = url.substring(i, i + SHORTCUT_LENGTH);
      var value = this.lookupTable[hash];
      if (value) {
        if (utils.collections.isArray(value)) {
          if (result === null) {
            result = [];
          }
          result = result.concat(value);
        } else {
          if (result === null) {
            result = [];
          }
          result.push(value);
        }
      }
    }

    return result;
  },

  /**
   * @returns {Array} rules in lookup table
   */
  getRules: function() {
    var result = [];
    for (var r in this.lookupTable) {
      // jshint ignore:line
      var value = this.lookupTable[r];
      if (value) {
        if (utils.collections.isArray(value)) {
          result = result.concat(value);
        } else {
          result.push(value);
        }
      }
    }

    return result;
  }
};

module.exports = ShortcutsLookupTable;
