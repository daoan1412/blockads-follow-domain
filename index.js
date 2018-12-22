const CssFilter = require("./filter/rules/css-filter");
const CssFilterRule = require("./filter/rules/css-filter-rule");
const UrlFilterRule = require("./filter/rules/url-filter-rule");
const UrlFilter = require("./filter/rules/url-filter");
const SafariContentBlockerConverter = require("./filter/rules/converter");
var CleanCSS = require("clean-css");

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

  getCssCommonRules(rulesArray) {
    const cssRules = this.convertRulesDataToCommonCssRules(rulesArray)
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
    const filterCss = new CssFilter(cssRules);
    const rawCss = filterCss
      .buildCssHits("https://google.com", CssFilter.RETRIEVE_TRADITIONAL_CSS)
      .css.join("\n");
    return new CleanCSS({
      level: {
        2: {
          mergeAdjacentRules: true, // controls adjacent rules merging; defaults to true
          mergeIntoShorthands: true, // controls merging properties into shorthands; defaults to true
          mergeMedia: true, // controls `@media` merging; defaults to true
          mergeNonAdjacentRules: true, // controls non-adjacent rule merging; defaults to true
          mergeSemantically: false, // controls semantic merging; defaults to false
          overrideProperties: true, // controls property overriding based on understandability; defaults to true
          removeEmpty: true, // controls removing empty rules and nested blocks; defaults to `true`
          reduceNonAdjacentRules: true, // controls non-adjacent rule reducing; defaults to true
          removeDuplicateFontRules: true, // controls duplicate `@font-face` removing; defaults to true
          removeDuplicateMediaBlocks: true, // controls duplicate `@media` removing; defaults to true
          removeDuplicateRules: true, // controls duplicate rules removing; defaults to true
          removeUnusedAtRules: false, // controls unused at rule removing; defaults to false (available since 4.1.0)
          restructureRules: false, // controls rule restructuring; defaults to false
          skipProperties: [] // controls which properties won't be optimized, defaults to `[]` which means all will be optimized (since 4.1.0)
        }
      }
    }).minify(rawCss).styles;
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

  convertToContentBlocking(dataJson) {
    const safariJSON = SafariContentBlockerConverter.convertArray(
      dataJson,
      null,
      true
    );
    if (safariJSON.converted.length > 0) {
      return safariJSON.converted.replace(/(\t|\n|)/gm, "");
    } else {
      return null;
    }
  }
}

module.exports = BlockAds;
