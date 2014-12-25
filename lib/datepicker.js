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
    showYearPrevNext: false,
    disableBefore: null,
    disableAfter: null,
    format: 'YYYY-MM-DD',
    width: null,
    viewDate: null
  };

  Datepicker.prototype._init = function() {
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple datepicker: option el is required';
      return;
    }
    return this._render();
  };

  Datepicker.prototype._render = function() {
    if (this.opts.inline) {
      return this._show();
    } else {
      this.el.on('focus click', (function(_this) {
        return function(e) {
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
    val = this.el.val();
    if (val) {
      this.selectedDate = moment(val, this.opts.format);
    }
    this._viewType = 'calendar';
    this._viewDate = this.opts.viewDate || this.selectedDate || moment().startOf('day');
    return this.update();
  };

  Datepicker.prototype._hide = function() {
    if (this.cal) {
      this.cal.remove();
      return this.cal = null;
    }
  };

  Datepicker.prototype.update = function(date, type) {
    var panel;
    type || (type = this._viewType);
    date || (date = this._viewDate);
    if (!this.cal) {
      this.cal = $('<div class="simple-datepicker"></div>');
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
      this._bindEvent();
    }
    panel = (function() {
      switch (type) {
        case 'yearmonth':
          return this._renderYearMonth(date);
        default:
          return this._renderCal(date);
      }
    }).call(this);
    this.cal.html(panel);
    this._calendar = this.cal.find('.calendar');
    this._yearmonth = this.cal.find('.datepicker-yearmonth').data('tmpDate', date.clone());
    this._viewType = type;
    return this._viewDate = date;
  };

  Datepicker.prototype._bindEvent = function() {
    return this.cal.on('mousedown click', function(e) {
      return false;
    }).on('click', '.datepicker-title a', (function(_this) {
      return function(e) {
        return _this.update(null, 'yearmonth');
      };
    })(this)).on('click', '.datepicker-prev a, .datepicker-next a', (function(_this) {
      return function(e) {
        var date, direction;
        e.preventDefault();
        direction = $(e.currentTarget).is('.datepicker-prev a') ? -1 : 1;
        date = _this._viewDate.clone().add(direction, 'months');
        return _this.update(date);
      };
    })(this)).on('click', '.datepicker-day a', (function(_this) {
      return function(e) {
        var btn, date;
        e.preventDefault();
        btn = $(e.currentTarget);
        if (btn.hasClass('disabled')) {
          return;
        }
        date = moment(btn.data('date'), 'YYYY-MM-DD');
        _this.el.val(date.format(_this.opts.format));
        _this.selectedDate = date;
        _this._viewDate = date;
        _this.cal.find('.datepicker-day a.selected').removeClass('selected');
        btn.addClass('selected');
        if (!_this.opts.inline) {
          _this._hide();
        }
        return _this.trigger('select', [date]);
      };
    })(this)).on('click', '.datepicker-yearmonth-cancel, .datepicker-yearmonth-title a', (function(_this) {
      return function(e) {
        return _this.update(null, 'calendar');
      };
    })(this)).on('click', '.datepicker-yearmonth-ok', (function(_this) {
      return function(e) {
        var date;
        e.preventDefault();
        date = _this._yearmonth.data('tmpDate');
        return _this.update(date, 'calendar');
      };
    })(this)).on('click', '.datepicker-year-prev a, .datepicker-year-next a', (function(_this) {
      return function(e) {
        var btn, currentYear, direction, firstYear, years;
        e.preventDefault();
        btn = $(e.currentTarget);
        currentYear = _this._yearmonth.data('tmpDate').year();
        direction = btn.is('.datepicker-year-prev a') ? -10 : 10;
        firstYear = _this.cal.find('.datepicker-year a:first').data('year') * 1 + direction;
        years = _this._renderYearSelectors(firstYear, currentYear);
        return _this.cal.find('.datepicker-year-list').html(years);
      };
    })(this)).on('click', '.datepicker-year a, .datepicker-month a', (function(_this) {
      return function(e) {
        var btn, date;
        e.preventDefault();
        btn = $(e.currentTarget);
        date = _this._yearmonth.data('tmpDate');
        if (btn.is('.datepicker-year a')) {
          date.set('year', btn.data('year') * 1);
        } else {
          date.set('month', btn.data('month') * 1);
        }
        _this._yearmonth.data('tmpDate', date);
        btn.parent().siblings().find('a.selected').removeClass('selected');
        btn.addClass('selected');
        return _this.cal.find('.datepicker-yearmonth-title a').html(_this._formatTitle(date));
      };
    })(this));
  };

  Datepicker.prototype._renderCal = function(viewDate) {
    var next, prev, title;
    prev = '';
    next = '';
    if (this.opts.showPrevNext) {
      prev = '<a href="javascript:;" class="fa fa-chevron-left"></a>';
      next = '<a href="javascript:;" class="fa fa-chevron-right"></a>';
    }
    title = this._formatTitle(viewDate);
    return "<table class=\"calendar\">\n  <tr>\n    <td class=\"datepicker-prev\">\n      " + prev + "\n    </td>\n    <td class=\"datepicker-title\" colspan=\"5\">\n      <a href=\"javascript:;\">" + title + "</a>\n    </td>\n    <td class=\"datepicker-next\">\n      " + next + "\n    </td>\n  </tr>\n  <tr class=\"datepicker-dow\">\n    <td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>\n  </tr>\n  " + (this._renderDaySelectors(viewDate)) + "\n</table>";
  };

  Datepicker.prototype._renderYearMonth = function(viewDate) {
    var currentMonth, currentYear, next, prev, title;
    prev = '';
    next = '';
    if (this.opts.showYearPrevNext) {
      prev = "<div class=\"datepicker-year-prev\">\n  <a href=\"javascript:;\" class=\"fa fa-chevron-up\"></a>\n</div>";
      next = "<div class=\"datepicker-year-next\">\n  <a href=\"javascript:;\" class=\"fa fa-chevron-down\"></a>\n</div>";
    }
    title = this._formatTitle(viewDate);
    currentYear = viewDate.year();
    currentMonth = viewDate.month();
    return "<div class=\"datepicker-yearmonth\">\n  <div class='datepicker-yearmonth-title'>\n    <a href='javascript:;'>\n      " + title + "\n    </a>\n  </div>\n  <div class=\"datepicker-year-container\">\n    " + prev + "\n    <ul class=\"datepicker-year-list\">" + (this._renderYearSelectors(currentYear - 5, currentYear)) + "</ul>\n    " + next + "\n  </div>\n  <div class=\"datepicker-month-container\">\n    <ul class=\"datepicker-month-list\">" + (this._renderMonthSelectors(currentMonth)) + "</ul>\n  </div>\n  <div class=\"datepicker-yearmonth-confirm\">\n    <a href=\"javascript:;\" class=\"datepicker-yearmonth-ok\">确定</a>\n    <a href=\"javascript:;\" class=\"datepicker-yearmonth-cancel\">取消</a>\n  </div>\n</div>";
  };

  Datepicker.prototype._renderYearSelectors = function(firstYear, selectedYear) {
    var y, years, _i, _ref;
    years = '';
    for (y = _i = firstYear, _ref = firstYear + 10; firstYear <= _ref ? _i < _ref : _i > _ref; y = firstYear <= _ref ? ++_i : --_i) {
      years += "<li class=\"datepicker-year\">\n  <a href=\"javascript:;\" class=\"" + (y === selectedYear ? 'selected' : '') + "\" data-year=\"" + y + "\">\n    " + y + "\n  </a>\n</li>";
    }
    return years;
  };

  Datepicker.prototype._renderMonthSelectors = function(selectedMonth) {
    var m, months, _i;
    months = '';
    for (m = _i = 0; _i <= 11; m = ++_i) {
      months += "<li class=\"datepicker-month\">\n  <a href=\"javascript:;\" class=\"" + (m === selectedMonth ? 'selected' : '') + "\" data-month=\"" + m + "\">\n    " + (moment.monthsShort()[m]) + "\n  </a>\n</li>";
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
    return viewDate.format('YYYY年M月');
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

  Datepicker.prototype.setSelectedDate = function(date) {
    if (!date) {
      this.selectedDate = null;
      this.el.val("");
    } else {
      date = moment(date, this.opts.format);
      this.selectedDate = date;
      this.el.val(date.format(this.opts.format));
    }
    this.cal && this.update(date);
    return this.trigger('select', [date]);
  };

  return Datepicker;

})(SimpleModule);

datepicker = function(opts) {
  return new Datepicker(opts);
};

return datepicker;

}));

