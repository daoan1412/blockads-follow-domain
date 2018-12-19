const punycode = require("./punycode");
const common = require("./common");

module.exports = {
  url: {
    toPunyCode: function(domain) {
      if (!domain) {
        return "";
      }
      if (/^[\x00-\x7F]+$/.test(domain)) {
        return domain;
      }
      return punycode.toASCII(domain);
    },
    /**
     * Checks all domains from domainNames with isDomainOrSubDomain
     * @param domainNameToCheck Domain name to check
     * @param domainNames List of domain names
     * @returns boolean true if there is suitable domain in domainNames
     */
    isDomainOrSubDomainOfAny: function(domainNameToCheck, domainNames) {
      if (!domainNames || domainNames.length == 0) {
        return false;
      }

      for (var i = 0; i < domainNames.length; i++) {
        if (this.isDomainOrSubDomain(domainNameToCheck, domainNames[i])) {
          return true;
        }
      }

      return false;
    },
    /**
     * Checks if the specified domain is a sub-domain of equal to domainName
     *
     * @param domainNameToCheck Domain name to check
     * @param domainName        Domain name
     * @returns boolean true if there is suitable domain in domainNames
     */
    isDomainOrSubDomain: (function() {
      /**
       * Extract from domain name tld if exists
       *
       * @param {string} domainName
       * @returns {string} string is empty if tld doesn't exist
       */
      function extractTld(domainName) {
        var guess = domainName;
        var dotIndex = guess.indexOf(".");
        while (dotIndex >= 0) {
          if (guess in RESERVED_DOMAINS) {
            return guess;
          }
          guess = guess.slice(dotIndex + 1, guess.length);
          dotIndex = guess.indexOf(".");
        }
        if (guess in RESERVED_DOMAINS) {
          return guess;
        }
        return "";
      }

      /**
       * Generates from domain tld wildcard e.g. google.com -> google.* ; youtube.co.uk -> youtube.*
       *
       * @param {string} domainName
       * @returns {string} string is empty if tld for provided domain name doesn't exists
       */
      function genTldWildcard(domainName) {
        var tld = extractTld(domainName);
        if (tld) {
          return domainName.slice(0, domainName.indexOf("." + tld)) + ".*";
        }
        return "";
      }

      function matchAsWildcard(wildcard, domainNameToCheck) {
        var wildcardedDomainToCheck = genTldWildcard(domainNameToCheck);
        if (wildcardedDomainToCheck) {
          return (
            wildcardedDomainToCheck === wildcard ||
            (common.strings.endsWith(wildcardedDomainToCheck, wildcard) &&
              common.strings.endsWith(wildcardedDomainToCheck, "." + wildcard))
          );
        }
        return false;
      }

      function isWildcardDomain(domainName) {
        return common.strings.endsWith(domainName, ".*");
      }

      return function(domainNameToCheck, domainName) {
        // Checks if domain name from rule is tld wildcard
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/571
        if (isWildcardDomain(domainName)) {
          return matchAsWildcard(domainName, domainNameToCheck);
        }
        // Double endsWith check is memory optimization
        // Works in android, not sure if it makes sense here
        return (
          domainName == domainNameToCheck ||
          (common.strings.endsWith(domainNameToCheck, domainName) &&
            common.strings.endsWith(domainNameToCheck, "." + domainName))
        );
      };
    })()
  }
};
