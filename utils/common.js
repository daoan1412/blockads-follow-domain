if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(suffix) {
    // jshint ignore:line
    var index = this.lastIndexOf(suffix);
    return index !== -1 && index === this.length - suffix.length;
  };
}

module.exports = {
  /****************************** */
  /****************************** */
  /* Strings */
  /****************************** */
  /****************************** */
  strings: {
    isEmpty: function(str) {
      return !str || str.trim().length === 0;
    },

    startWith: function(str, prefix) {
      return str && str.indexOf(prefix) === 0;
    },

    endsWith: function(str, postfix) {
      return str.endsWith(postfix);
    },

    substringAfter: function(str, separator) {
      if (!str) {
        return str;
      }
      var index = str.indexOf(separator);
      return index < 0 ? "" : str.substring(index + separator.length);
    },

    substringBefore: function(str, separator) {
      if (!str || !separator) {
        return str;
      }
      var index = str.indexOf(separator);
      return index < 0 ? str : str.substring(0, index);
    },

    contains: function(str, searchString) {
      return str && str.indexOf(searchString) >= 0;
    },

    containsIgnoreCase: function(str, searchString) {
      return (
        str &&
        searchString &&
        str.toUpperCase().indexOf(searchString.toUpperCase()) >= 0
      );
    },

    replaceAll: function(str, find, replace) {
      if (!str) {
        return str;
      }
      return str.split(find).join(replace);
    },

    join: function(array, separator, startIndex, endIndex) {
      if (!array) {
        return null;
      }
      if (!startIndex) {
        startIndex = 0;
      }
      if (!endIndex) {
        endIndex = array.length;
      }
      if (startIndex >= endIndex) {
        return "";
      }
      var buf = [];
      for (var i = startIndex; i < endIndex; i++) {
        buf.push(array[i]);
      }
      return buf.join(separator);
    },
    /**
     * Look for any symbol from "chars" array starting at "start" index or from the start of the string
     *
     * @param str   String to search
     * @param chars Chars to search for
     * @param start Start index (optional, inclusive)
     * @return int Index of the element found or null
     */
    indexOfAny: function(str, chars, start) {
      start = start || 0;

      if (typeof str === "string" && str.length <= start) {
        return -1;
      }

      for (var i = start; i < str.length; i++) {
        var c = str.charAt(i);
        if (chars.indexOf(c) > -1) {
          return i;
        }
      }

      return -1;
    }
  },

  /****************************** */
  /****************************** */
  /* Collections */
  /****************************** */
  /****************************** */

  collections: {
    remove: function(collection, element) {
      if (!element || !collection) {
        return;
      }
      var index = collection.indexOf(element);
      if (index >= 0) {
        collection.splice(index, 1);
      }
    },

    removeAll: function(collection, element) {
      if (!element || !collection) {
        return;
      }
      for (var i = collection.length - 1; i >= 0; i--) {
        if (collection[i] == element) {
          collection.splice(i, 1);
        }
      }
    },

    removeRule: function(collection, rule) {
      if (!rule || !collection) {
        return;
      }
      for (var i = collection.length - 1; i >= 0; i--) {
        if (rule.ruleText === collection[i].ruleText) {
          collection.splice(i, 1);
        }
      }
    },

    removeDuplicates: function(arr) {
      if (!arr || arr.length == 1) {
        return arr;
      }
      return arr.filter(function(elem, pos) {
        return arr.indexOf(elem) == pos;
      });
    },

    getRulesText: function(collection) {
      var text = [];
      if (!collection) {
        return text;
      }
      for (var i = 0; i < collection.length; i++) {
        text.push(collection[i].ruleText);
      }
      return text;
    },

    /**
     * Find element in array by property
     * @param array
     * @param property
     * @param value
     * @returns {*}
     */
    find: function(array, property, value) {
      if (typeof array.find === "function") {
        return array.find(function(a) {
          return a[property] === value;
        });
      }
      for (var i = 0; i < array.length; i++) {
        var elem = array[i];
        if (elem[property] === value) {
          return elem;
        }
      }
      return null;
    },

    /**
     * Checks if specified object is array
     * We don't use instanceof because it is too slow: http://jsperf.com/instanceof-performance/2
     * @param obj Object
     */
    isArray:
      Array.isArray ||
      function(obj) {
        return "" + obj === "[object Array]";
      }
  }
};
