/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.6.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2017, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function (timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  const $t = $.timeago;
  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: lang.lang_time_prefixAgo,
        prefixFromNow: lang.lang_time_prefixFromNow,
        suffixAgo: lang.lang_time_suffixAgo,
        suffixFromNow: lang.lang_time_suffixFromNow,
        inPast: lang.lang_time_inPast,
        seconds: lang.lang_time_seconds,
        minute: lang.lang_time_minute,
        minutes: lang.lang_time_minutes,
        hour: lang.lang_time_hour,
        hours: lang.lang_time_hours,
        day: lang.lang_time_day,
        days: lang.lang_time_days,
        month: lang.lang_time_month,
        months: lang.lang_time_months,
        year: lang.lang_time_year,
        years: lang.lang_time_years,
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function (distanceMillis) {
      if (!this.settings.allowPast && !this.settings.allowFuture) {
        throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      const $l = this.settings.strings;
      let prefix = $l.prefixAgo;
      let suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      const seconds = Math.abs(distanceMillis) / 1000;
      const minutes = seconds / 60;
      const hours = minutes / 60;
      const days = hours / 24;
      const years = days / 365;

      function substitute(stringOrFunction, number) {
        const string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        const value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      const words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

        const separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function (iso8601) {
      let s = $.trim(iso8601);
      s = s.replace(/\.\d+/, ""); // remove milliseconds
      s = s.replace(/-/, "/").replace(/-/, "/");
      s = s.replace(/T/, " ").replace(/Z/, " UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/, " $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function (elem) {
      const iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function (elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  const functions = {
    init: function () {
      functions.dispose.call(this);
      const refresh_el = $.proxy(refresh, this);
      refresh_el();
      const $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function (timestamp) {
      const date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
      $(this).data('timeago', { datetime: date });
      if ($t.settings.localeTitle) {
        $(this).attr("title", date.toLocaleString());
      }
      refresh.apply(this);
    },
    updateFromDOM: function () {
      $(this).data('timeago', { datetime: $t.parse($t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title")) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function (action, options) {
    const fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '" + action + "' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function () {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    const $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement, this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    const data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ($s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      } else {
        if ($(this).attr('title').length > 0) {
          $(this).text($(this).attr('title'));
        }
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      const text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));