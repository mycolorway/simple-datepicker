(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-datepicker', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['datepicker'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Datepicker, datepicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Datepicker = (function(_super) {
  __extends(Datepicker, _super);

  function Datepicker() {
    return Datepicker.__super__.constructor.apply(this, arguments);
  }

  Datepicker.prototype.opts = {
    el: null,
    inline: false,
    showPrevNext: true,
    showYearPrevNext: true,
    disableBefore: null,
    disableAfter: null,
    format: "YYYY-MM-DD",
    width: null,
    month: null
  };

  Datepicker.monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  Datepicker.prototype._init = function() {
    var val;
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw "simple datepicker: option el is required";
      return;
    }
    val = this.el.val();
    if (val) {
      this.selectedDate = moment(val, this.opts.format);
    }
    return this._render();
  };

  Datepicker.prototype._render = function() {
    if (this.opts.inline) {
      return this._show();
    } else {
      this.el.focus((function(_this) {
        return function(e) {
          return _this._show();
        };
      })(this)).focus();
      return $(document).on("click.datepicker", (function(_this) {
        return function(e) {
          return _this._hide();
        };
      })(this));
    }
  };

  Datepicker.prototype._show = function() {
    return this.update(this.opts.month);
  };

  Datepicker.prototype._hide = function() {
    if (this.cal) {
      this.cal.remove();
      this.cal = null;
      return $(document).off(".datepicker");
    }
  };

  Datepicker.prototype.update = function(date, usage) {
    var offset, panel, theDate, today;
    today = moment().startOf("day");
    theDate = date || this.el.data("theDate") || this.selectedDate || today;
    this.el.data("theDate", theDate);
    panel = (function() {
      switch (usage) {
        case 'yearmonth':
          return this._renderYearMonthSelector(theDate);
        default:
          return this._renderCal(theDate);
      }
    }).call(this);
    if (!this.cal) {
      this.cal = $("<div class='simple-datepicker'></div>").insertAfter(this.el);
      this.cal.data("datepicker", this);
      if (!this.opts.inline) {
        offset = this.el.offset();
        this.cal.css({
          position: "absolute",
          "z-index": 100,
          left: offset.left,
          top: offset.top + this.el.outerHeight(true)
        });
      }
      this.cal.on("mousedown", function(e) {
        return false;
      }).on("click", function(e) {
        return false;
      }).on("click", ".datepicker-title a", (function(_this) {
        return function(e) {
          return _this.update(null, 'yearmonth');
        };
      })(this)).on("click", ".datepicker-prev a", (function(_this) {
        return function(e) {
          var btn, newDate;
          btn = $(e.currentTarget);
          date = _this.el.data("theDate");
          newDate = date.clone().add(-1, "months");
          _this.el.data("theDate", newDate);
          return _this.update();
        };
      })(this)).on("click", ".datepicker-next a", (function(_this) {
        return function(e) {
          var btn, newDate;
          btn = $(e.currentTarget);
          date = _this.el.data("theDate");
          newDate = date.clone().add("months", 1);
          _this.el.data("theDate", newDate);
          return _this.update();
        };
      })(this)).on("click", ".datepicker-day a", (function(_this) {
        return function(e) {
          var btn, day;
          e.preventDefault();
          btn = $(e.currentTarget);
          if (btn.hasClass("disabled")) {
            return;
          }
          day = btn.text();
          date = moment(btn.data("date"), "YYYY-MM-DD");
          _this.el.data("theDate", date);
          _this.el.val(date.format(_this.opts.format));
          _this.selectedDate = date;
          _this.cal.find(".datepicker-day a.selected").removeClass("selected");
          btn.addClass("selected");
          if (!_this.opts.inline) {
            _this._hide();
          }
          return _this.trigger("select", [date.format(_this.opts.format), btn]);
        };
      })(this)).on("click", ".datepicker-yearmonth-cancel,.datepicker-yearmonth-title a", (function(_this) {
        return function(e) {
          return _this.update();
        };
      })(this)).on("click", ".datepicker-yearmonth-ok", (function(_this) {
        return function(e) {
          var selectedMonth, selectedYear;
          e.preventDefault();
          date = _this.el.data("theDate") || _this.selectedDate || moment().startOf("day");
          date = date.clone();
          selectedYear = _this._yearmonth.data('year') * 1;
          selectedMonth = _this._yearmonth.data('month') * 1;
          date.set('year', selectedYear);
          date.set('month', selectedMonth);
          _this.el.data("theDate", date);
          return _this.update();
        };
      })(this)).on("click", ".datepicker-yearmonth .datepicker-year-prev a,.datepicker-yearmonth .datepicker-year-next a", (function(_this) {
        return function(e) {
          var btn, currentYear, year, years, _i, _ref, _results;
          e.preventDefault();
          currentYear = _this._yearmonth.data('year') * 1;
          btn = $(e.currentTarget);
          year = $(_this.cal.find('.datepicker-yearmonth .datepicker-year a').get(0)).data('year') * 1;
          if (isNaN(year)) {
            year = currentYear - 5;
          } else {
            if (btn.parent().hasClass('datepicker-year-prev')) {
              year -= 10;
            } else {
              year += 10;
            }
          }
          years = _this._renderYearSelectors((function() {
            _results = [];
            for (var _i = year, _ref = year + 9; year <= _ref ? _i <= _ref : _i >= _ref; year <= _ref ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this), currentYear);
          return _this.cal.find('.datepicker-yearmonth .datepicker-year-list').html(years);
        };
      })(this)).on("click", ".datepicker-yearmonth .datepicker-year a,.datepicker-yearmonth .datepicker-month a", (function(_this) {
        return function(e) {
          var btn, li, month, year;
          e.preventDefault();
          btn = $(e.currentTarget);
          li = btn.parent();
          if (li.hasClass('datepicker-year')) {
            year = btn.data('year') * 1;
            month = _this._yearmonth.data('month');
            _this._yearmonth.data('year', year);
          } else {
            month = btn.data('month') * 1;
            year = _this._yearmonth.data('year');
            _this._yearmonth.data('month', month);
          }
          btn.parent().siblings().find('a.selected').removeClass('selected');
          btn.addClass('selected');
          return _this.cal.find('.datepicker-yearmonth .datepicker-yearmonth-title a').html(_this._formatTitle(year, month));
        };
      })(this));
    }
    if (this.opts.width) {
      this.cal.css("width", this.opts.width);
    }
    this.cal.html(panel);
    this._calendar = this.cal.find('.calendar');
    this._yearmonth = this.cal.find('.datepicker-yearmonth');
    return this.trigger("beforeUpdate", [this.cal]);
  };

  Datepicker.prototype._renderCal = function(theDate) {
    var calendar, showN, showP;
    showP = showN = true;
    if (!this.opts.showPrevNext) {
      showP = showN = false;
    }
    calendar = "<table class=\"calendar\">\n  <tr>\n    <td class=\"datepicker-prev\">\n      " + (showP ? '<a href="javascript:;" class="fa fa-chevron-left"></a>' : void 0) + "\n    </td>\n    <td class=\"datepicker-title\" colspan=\"5\">\n      <a href=\"javascript:;\">" + (this._formatTitle(theDate.year(), theDate.month())) + "</a>\n    </td>\n    <td class=\"datepicker-next\">\n      " + (showN ? '<a href="javascript:;" class="fa fa-chevron-right"></a>' : void 0) + "\n    </td>\n  </tr>\n  <tr class=\"datepicker-dow\">\n    <td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>\n  </tr>\n  " + (this._renderDaySelectors(theDate)) + "\n</table>";
    return calendar;
  };

  Datepicker.prototype._renderYearMonthSelector = function(theDate) {
    var currentMonth, currentYear, showN, showP, _i, _ref, _ref1, _results;
    showP = showN = true;
    if (!this.opts.showYearPrevNext) {
      showP = showN = false;
    }
    currentYear = theDate.year();
    currentMonth = theDate.month();
    return "<div class=\"datepicker-yearmonth\" data-year=\"" + currentYear + "\" data-month=\"" + currentMonth + "\">\n  <div class='datepicker-yearmonth-title'>\n    <a href='javascript:;'>\n      " + (this._formatTitle(currentYear, currentMonth)) + "\n    </a>\n  </div>\n  <div class=\"datepicker-year-container\">\n    " + (showP ? '<div class="datepicker-year-prev"><a href="javascript:;" class="fa fa-chevron-up"></a></div>' : void 0) + "\n    <ul class=\"datepicker-year-list\">" + (this._renderYearSelectors((function() {
      _results = [];
      for (var _i = _ref = currentYear - 5, _ref1 = currentYear + 4; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), currentYear)) + "</ul>\n    " + (showN ? '<div class="datepicker-year-next"><a href="javascript:;" class="fa fa-chevron-down"></a></div>' : void 0) + "\n  </div>\n  <div class=\"datepicker-month-container\">\n    <ul class=\"datepicker-month-list\">" + (this._renderMonthSelectors(currentMonth)) + "</ul>\n  </div>\n  <div class=\"datepicker-yearmonth-confirm\">\n    <a href=\"javascript:;\" class=\"datepicker-yearmonth-cancel\">取消</a>\n    <a href=\"javascript:;\" class=\"datepicker-yearmonth-ok\">确定</a>\n  </div>\n</div>";
  };

  Datepicker.prototype._renderYearSelectors = function(range, theYear) {
    var years, _i, _len, _year;
    years = '';
    for (_i = 0, _len = range.length; _i < _len; _i++) {
      _year = range[_i];
      years += "<li class=\"datepicker-year\">\n  <a href=\"javascript:;\" class=\"" + (_year === theYear ? 'selected' : void 0) + "\" data-year=\"" + _year + "\">\n    " + _year + "\n  </a>\n</li>";
    }
    return years;
  };

  Datepicker.prototype._renderMonthSelectors = function(theMonth) {
    var months, _i, _month;
    months = '';
    for (_month = _i = 0; _i <= 11; _month = ++_i) {
      months += "<li class=\"datepicker-month\">\n  <a href=\"javascript:;\" class=\"" + (_month === theMonth ? 'selected' : void 0) + "\" data-month=\"" + _month + "\">\n    " + Datepicker.monthNames[_month] + "\n  </a>\n</li>";
    }
    return months;
  };

  Datepicker.prototype._renderDaySelectors = function(theDate) {
    var c, date, days, firstDate, i, lastDate, n, p, prevLastDate, row, today, until_, x, y;
    today = moment().startOf("day");
    firstDate = theDate.clone().startOf("month");
    lastDate = theDate.clone().endOf("month");
    prevLastDate = theDate.clone().add(-1, "months").endOf("month");
    days = "";
    y = 0;
    i = 0;
    while (y < 6) {
      row = "";
      x = 0;
      while (x < 7) {
        p = (prevLastDate.date() - prevLastDate.day()) + i + 1;
        n = p - prevLastDate.date();
        c = (x === 6 ? "sun" : (x === 5 ? "sat" : "day"));
        date = theDate.clone().date(n);
        if (n >= 1 && n <= lastDate.date()) {
          c += (today.diff(date) === 0 ? " today" : "");
          if (moment.isMoment(this.opts.disableBefore)) {
            until_ = moment(this.opts.disableBefore, "YYYY-MM-DD");
            c += (date.diff(until_) < 0 ? " disabled" : "");
          }
          if (moment.isMoment(this.opts.disableAfter)) {
            until_ = moment(this.opts.disableAfter, "YYYY-MM-DD");
            c += (date.diff(until_) > 0 ? " disabled" : "");
          }
          if (this.selectedDate) {
            c += (date.diff(this.selectedDate) === 0 ? " selected" : " ");
          }
        } else if (n > lastDate.date() && x === 0) {
          break;
        } else {
          c = (x === 6 ? "sun" : (x === 5 ? "sat" : "day")) + " others";
          n = (n <= 0 ? p : (p - lastDate.date()) - prevLastDate.date());
        }
        row += "<td class='datepicker-day'>\n  <a href=\"javascript:;\" class=\"" + c + "\" data-date=\"" + (date.format('YYYY-MM-DD')) + "\">\n    " + n + "\n  </a>\n</td>";
        x++;
        i++;
      }
      if (row) {
        days += "<tr class=\"days\">" + row + "</tr>";
      }
      y++;
    }
    return days;
  };

  Datepicker.prototype._formatTitle = function(year, month) {
    return "" + year + "年" + Datepicker.monthNames[month];
  };

  Datepicker.prototype.setSelectedDate = function(date) {
    if (!date) {
      this.selectedDate = null;
      this.el.val("");
    } else {
      this.selectedDate = moment(date, this.opts.format);
      this.el.val(this.selectedDate.format(this.opts.format));
      this.el.removeData("theDate");
    }
    return this.cal && this.update();
  };

  return Datepicker;

})(SimpleModule);

datepicker = function(opts) {
  return new Datepicker(opts);
};

return datepicker;

}));

