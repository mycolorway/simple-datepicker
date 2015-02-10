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
    disableBefore: null,
    disableAfter: null,
    format: 'YYYY-MM-DD',
    width: null,
    monthpicker: false
  };

  Datepicker.prototype._init = function() {
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple datepicker: option el is required';
      return;
    }
    if (this.opts.monthpicker) {
      this.opts.format = 'YYYY-MM';
    }
    this.el.data('datepicker', this);
    return this._render();
  };

  Datepicker.prototype._render = function() {
    if (this.opts.inline) {
      return this._show();
    } else {
      this.el.on('focus click', (function(_this) {
        return function(e) {
          if (_this.cal) {
            return;
          }
          return _this._show();
        };
      })(this));
      return $(document).on("click.datepicker", (function(_this) {
        return function(e) {
          if (!(_this.el.is(e.target) || _this.el.has(e.target).length)) {
            return _this._hide();
          }
        };
      })(this));
    }
  };

  Datepicker.prototype._show = function() {
    var val;
    val = this.el.val() || moment();
    this.date = moment.isMoment(val) ? val : moment(val, this.opts.format);
    this._renderPanel();
    return this._bindEvent();
  };

  Datepicker.prototype._hide = function() {
    if (this.cal) {
      this.cal.remove();
      return this.cal = null;
    }
  };

  Datepicker.prototype._renderPanel = function() {
    var height, year, _calTemplate;
    _calTemplate = "<div class=\"simple-datepicker\">\n  <div class=\"datepicker-header\">\n    <a href=\"javascript:;\" class=\"fa fa-chevron-left datepicker-prev\"></a>\n    <a href=\"javascript:;\" class=\"datepicker-title\">" + (this._formatTitle(this.date)) + "</a>\n    <a href=\"javascript:;\" class=\"fa fa-chevron-right datepicker-next\"></a>\n  </div>\n</div>";
    this.cal = $(_calTemplate);
    if (this.opts.inline) {
      this.cal.insertAfter(this.el);
    } else {
      $('body').append(this.cal);
      this._setPosition();
    }
    this.cal.data('datepicker', this);
    if (this.opts.width) {
      this.cal.css("width", this.opts.width);
    }
    this.cal.append(this._renderYearMonth());
    if (!this.opts.monthpicker) {
      this.cal.append(this._renderCal());
    }
    this._calendar = this.cal.find('.calendar');
    this._monthpicker = this.cal.find('.datepicker-yearmonth');
    this._title = this.cal.find('.datepicker-title');
    this.yearContainer = this.cal.find('.datepicker-year-container');
    if (this.opts.monthpicker) {
      this._monthpicker.show();
      this.cal.find('.datepicker-header').remove();
      year = this.date.year();
      height = this._monthpicker.find('.datepicker-year').height();
      return this.yearContainer.scrollTop(height * (year - this.firstYear));
    } else {
      return this._calendar.find("[data-date=" + (this.date.format('YYYY-MM-DD')) + "]").addClass('selected');
    }
  };

  Datepicker.prototype._bindEvent = function() {
    this.cal.on('mousedown click', function(e) {
      return false;
    }).on('click', '.datepicker-title', (function(_this) {
      return function(e) {
        var height, year;
        if (!_this.opts.monthpicker) {
          _this._monthpicker.slideToggle();
        }
        if (!_this.opts.monthpicker) {
          _this.cal.toggleClass('shadowed');
        }
        year = _this.date.year();
        height = _this._monthpicker.find('.datepicker-year').height();
        return _this.yearContainer.scrollTop(height * (year - _this.firstYear));
      };
    })(this)).on('click', '.datepicker-prev, .datepicker-next', (function(_this) {
      return function(e) {
        var direction;
        e.preventDefault();
        direction = $(e.currentTarget).is('.datepicker-prev') ? -1 : 1;
        _this.date.add(direction, 'months');
        return _this._refresh();
      };
    })(this)).on('click', '.datepicker-day a', (function(_this) {
      return function(e) {
        var btn;
        e.preventDefault();
        btn = $(e.currentTarget);
        if (btn.hasClass('disabled')) {
          return;
        }
        _this.cal.find('.datepicker-day a.selected').removeClass('selected');
        btn.addClass('selected');
        _this.date = moment(btn.data('date'), 'YYYY-MM-DD');
        _this._updateDate();
        if (!_this.opts.inline) {
          return _this._hide();
        }
      };
    })(this)).on('click', '.datepicker-year a', (function(_this) {
      return function(e) {
        var $target, year;
        $target = $(e.currentTarget);
        year = $target.data('year');
        _this.date.year(year);
        return _this._refresh();
      };
    })(this)).on('click', '.datepicker-month a', (function(_this) {
      return function(e) {
        var $target, month;
        $target = $(e.currentTarget);
        month = $target.data('month');
        _this.date.months(month);
        _this._refresh();
        if (_this.opts.monthpicker) {
          _this._updateDate();
          if (!_this.opts.inline) {
            return _this._hide();
          }
        } else {
          _this._monthpicker.slideUp();
          return _this.cal.removeClass('shadowed');
        }
      };
    })(this));
    return this.cal.find('.datepicker-year-container').scroll((function(_this) {
      return function(e) {
        var height, scrollTop;
        scrollTop = $(e.target).scrollTop();
        if (scrollTop + 80 + 10 >= _this.yearContainer.children().height()) {
          _this.yearContainer.find('.datepicker-year-list').append(_this._renderYearSelectors(_this.lastYear, _this.lastYear + 5));
          return _this.lastYear = _this.lastYear + 5;
        } else if (scrollTop === 0) {
          _this.yearContainer.find('.datepicker-year-list').prepend(_this._renderYearSelectors(_this.firstYear - 5, _this.firstYear));
          _this.firstYear = _this.firstYear - 5;
          height = _this._monthpicker.find('.datepicker-year').height();
          return _this.yearContainer.scrollTop(height * 5);
        }
      };
    })(this));
  };

  Datepicker.prototype._refresh = function() {
    var date, month, year;
    if (this._calendar) {
      this._calendar.replaceWith(this._renderCal());
      this._calendar = this.cal.find('.calendar');
    }
    this._title.text(this._formatTitle(this.date));
    year = this.date.year();
    month = this.date.months();
    date = this.date.format(this.opts.format);
    this._monthpicker.find('.selected').removeClass('selected');
    this._monthpicker.find("[data-year=" + year + "]").addClass('selected');
    this._monthpicker.find("[data-month=" + month + "]").addClass('selected');
    return this._calendar.find("[data-date=" + date + "]").addClass('selected');
  };

  Datepicker.prototype._renderCal = function() {
    var i, week, _i, _len, _ref;
    week = '';
    _ref = [1, 2, 3, 4, 5, 6, 0];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<table class=\"calendar\">\n  <tr class=\"datepicker-dow\">\n    " + week + "\n  </tr>\n  " + (this._renderDaySelectors()) + "\n</table>";
  };

  Datepicker.prototype._renderYearMonth = function() {
    var currentMonth, currentYear, noSelected;
    noSelected = this.opts.monthpicker && !this.selectedDate;
    currentYear = this.date.year();
    currentMonth = this.date.month();
    this.firstYear = currentYear - 5;
    this.lastYear = currentYear + 10;
    return "<div class=\"datepicker-yearmonth\">\n  <div class=\"datepicker-year-container\">\n    <ul class=\"datepicker-year-list\">" + (this._renderYearSelectors(this.firstYear, this.lastYear, !noSelected ? currentYear : void 0)) + "</ul>\n  </div>\n  <div class=\"datepicker-month-container\">\n    <ul class=\"datepicker-month-list\">" + (this._renderMonthSelectors(!noSelected ? currentMonth : void 0)) + "</ul>\n  </div>\n</div>";
  };

  Datepicker.prototype._renderYearSelectors = function(firstYear, lastYear, selectedYear) {
    var y, years, _i;
    years = '';
    for (y = _i = firstYear; firstYear <= lastYear ? _i < lastYear : _i > lastYear; y = firstYear <= lastYear ? ++_i : --_i) {
      years += "<li class=\"datepicker-year\">\n  <a href=\"javascript:;\" class=\"" + (y === selectedYear ? 'selected' : '') + "\" data-year=\"" + y + "\">\n    " + y + "\n  </a>\n</li>";
    }
    return years;
  };

  Datepicker.prototype._renderMonthSelectors = function(selectedMonth) {
    var m, months, _i;
    months = '';
    for (m = _i = 0; _i <= 11; m = ++_i) {
      months += "<li class=\"datepicker-month\">\n  <a href=\"javascript:;\" class=\"" + (m === selectedMonth ? 'selected' : '') + "\" data-month=\"" + m + "\">\n    " + (moment.monthsShort(m)) + "\n  </a>\n</li>";
    }
    return months;
  };

  Datepicker.prototype._renderDaySelectors = function() {
    var c, date, days, firstDate, i, lastDate, n, p, prevLastDate, row, today, until_, x, y;
    today = moment().startOf("day");
    firstDate = this.date.clone().startOf("month");
    lastDate = this.date.clone().endOf("month");
    prevLastDate = this.date.clone().add(-1, "months").endOf("month");
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
        date = this.date.clone().date(n);
        if (n >= 1 && n <= lastDate.date()) {
          c += (today.diff(date) === 0 ? " today" : "");
          if (this.selectedDate) {
            c += (date.diff(this.selectedDate) === 0 ? " selected" : " ");
          }
        } else if (n > lastDate.date() && x === 0) {
          break;
        } else {
          c = (x === 6 ? "sun" : (x === 5 ? "sat" : "day")) + " others";
          n = (n <= 0 ? p : (p - lastDate.date()) - prevLastDate.date());
        }
        if (moment.isMoment(this.opts.disableBefore)) {
          until_ = moment(this.opts.disableBefore, "YYYY-MM-DD");
          c += (date.diff(until_) < 0 ? " disabled" : "");
        }
        if (moment.isMoment(this.opts.disableAfter)) {
          until_ = moment(this.opts.disableAfter, "YYYY-MM-DD");
          c += (date.diff(until_) > 0 ? " disabled" : "");
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

  Datepicker.prototype._formatTitle = function(viewDate) {
    return viewDate.format('YYYY MMMM');
  };

  Datepicker.prototype._setPosition = function() {
    var offset;
    offset = this.el.offset();
    return this.cal.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.el.outerHeight(true)
    });
  };

  Datepicker.prototype._updateDate = function() {
    this.el.val(this.date.format(this.opts.format));
    return this.trigger('select', [this.date]);
  };

  Datepicker.prototype.setDate = function(date) {
    this.date = moment.isMoment(date) ? date : moment(date, this.opts.format);
    this._refresh();
    return this.el.val(this.date.format(this.opts.format));
  };

  Datepicker.prototype.getDate = function() {
    if (this.el.val()) {
      return this.date;
    } else {
      return null;
    }
  };

  Datepicker.prototype.clear = function() {
    this.el.val('');
    this.date = moment();
    return this._refresh();
  };

  Datepicker.prototype.destroy = function() {
    var _ref;
    if ((_ref = this.cal) != null) {
      _ref.remove();
    }
    return this.cal = null;
  };

  return Datepicker;

})(SimpleModule);

datepicker = function(opts) {
  return new Datepicker(opts);
};

return datepicker;

}));

