(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-datepicker', ["jquery","simple-module"], function (a0,b1) {
      return (root['datepicker'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['datepicker'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Datepicker, datepicker,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Datepicker = (function(superClass) {
  extend(Datepicker, superClass);

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

  Datepicker.i18n = {
    'zh-CN': {
      year: '年',
      month: '月',
      currentYear: '今年',
      nextYear: '明年',
      lastYear: '去年',
      beforeLastYear: '去年'
    },
    'en': {
      year: 'Y',
      month: 'M',
      currentYear: 'current year',
      nextYear: 'new year',
      lastYear: 'last year',
      beforeLastYear: 'the year before last'
    }
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
    val = this.el.val() || moment().startOf(this.opts.monthpicker ? 'month' : 'day');
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
    var _calTemplate;
    _calTemplate = "<div class=\"simple-datepicker\">\n  <div class=\"datepicker-header\">\n    <a href=\"javascript:;\" class=\"datepicker-prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n    <a href=\"javascript:;\" class=\"datepicker-title\">" + (this._formatTitle(this.date)) + "</a>\n    <a href=\"javascript:;\" class=\"datepicker-next\"><i class=\"icon-chevron-right\"><span>&gt;</span></i></a>\n  </div>\n</div>";
    this.cal = $(_calTemplate);
    if (this.opts.inline) {
      this.cal.insertAfter(this.el);
    } else {
      $('body').append(this.cal);
      this._setPosition();
    }
    if (this.opts.monthpicker) {
      this.cal.addClass('simple-monthpicker');
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
    this._year = this._monthpicker.find('.year-input').val(this.date.year());
    this._month = this._monthpicker.find('.month-input').val(Number(this.date.month()) + 1);
    this._title = this.cal.find('.datepicker-title');
    if (this.opts.monthpicker) {
      this._monthpicker.show();
      return this.cal.find('.datepicker-header').remove();
    } else {
      return this._calendar.find("[data-date=" + (this.date.format('YYYY-MM-DD')) + "]").addClass('selected');
    }
  };

  Datepicker.prototype._bindEvent = function() {
    this.cal.on('mousedown click', function(e) {
      return false;
    }).on('click', '.datepicker-title', (function(_this) {
      return function(e) {
        if (!_this.opts.monthpicker) {
          _this.cal.toggleClass('expanded');
        }
        if (_this.cal.is('.expanded')) {
          return _this._year.focus();
        }
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
    })(this)).on('click mousedown', '.year-input, .month-input', function(e) {
      return $(this).focus();
    });
    this._monthpicker.on('keydown', '.year-input, .month-input', (function(_this) {
      return function(e) {
        var $input, direction, key, month, newData, year, yearInput;
        key = e.which;
        $input = $(e.currentTarget);
        if ($input.is('.year-input')) {
          yearInput = true;
        }
        if ([8, 27].indexOf(key) !== -1) {
          return;
        }
        if (key === 9) {
          if (yearInput) {
            year = Number($input.val());
            if (year < 50) {
              year += 2000;
            } else if (year < 100) {
              year += 1900;
            }
            $input.val(year);
            _this.date.year(year);
            _this._refresh();
            return;
          } else {
            month = $input.val() - 1;
            _this.date.months(month);
            _this._refresh();
            if (_this.opts.monthpicker) {
              _this._updateDate();
              if (!_this.opts.inline) {
                _this._hide();
              }
            } else {
              _this.cal.removeClass('expanded');
            }
            return;
          }
        }
        if (key === 13) {
          _this.date.year(_this._year.val());
          _this.date.months(_this._month.val() - 1);
          _this._refresh();
          if (_this.opts.monthpicker) {
            _this._updateDate();
            if (!_this.opts.inline) {
              _this._hide();
            }
          } else {
            _this.cal.removeClass('expanded');
          }
          return e.preventDefault();
        }
        if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(key) !== -1) {
          if (yearInput) {
            year = $input.val();
            if (Number(year) * 10 + key - 48 > 9999) {
              $input.val(year.substring(year.length - 3));
            }
          } else {
            month = $input.val();
            if (Number(month) * 10 + key - 48 > 12) {
              $input.val(month.substring(month.length));
            }
          }
          return;
        }
        if (key === 38 || key === 40) {
          direction = key === 38 ? 1 : -1;
          newData = Number($input.val()) + direction;
          if (yearInput) {
            if (newData > 9999) {
              newData = 1900;
            }
            if (newData < 1000) {
              newData = 1900;
            }
          } else {
            if (newData > 12) {
              newData = 1;
            }
            if (newData < 1) {
              newData = 12;
            }
          }
          $input.val(newData);
          return e.preventDefault();
        }
        return e.preventDefault();
      };
    })(this));
    this._monthpicker.on('click', '.icon-triangle-down', (function(_this) {
      return function(e) {
        var $popover, $target, $wrapper;
        e.stopPropagation();
        $target = $(e.currentTarget);
        $wrapper = $target.parent();
        $popover = $wrapper.next('.datepicker-popover');
        if ($popover.is('.expanded')) {
          $popover.removeClass('expanded');
          return;
        }
        $(document).off('click.datepicker-popover');
        _this.cal.off('click.datepicker-popover');
        _this._monthpicker.find('.datepicker-popover').removeClass('expanded');
        $popover.css('width', $wrapper.outerWidth());
        $popover.addClass('expanded');
        _this.cal.one('click.datepicker-popover', function(e) {
          $(document).off('click.datepicker-popover');
          return $popover.removeClass('expanded');
        });
        return $(document).one('click.datepicker-popover', function(e) {
          _this.cal.off('click.datepicker-popover');
          return $popover.removeClass('expanded');
        });
      };
    })(this));
    return this._monthpicker.on('click', '.datepicker-popover p', (function(_this) {
      return function(e) {
        var $input, $popover, $target, value;
        e.stopPropagation();
        $target = $(e.currentTarget);
        value = $target.data('value');
        $popover = $target.parent('.datepicker-popover');
        $input = $popover.prev('.input-wrapper').find('input');
        $input.val(value + 1);
        _this.date.set($input.data('type'), value);
        _this._refresh();
        return $popover.removeClass('expanded');
      };
    })(this));
  };

  Datepicker.prototype._refresh = function() {
    var date, month, year;
    if (!this.cal) {
      return;
    }
    if (!this.opts.monthpicker) {
      this._calendar.replaceWith(this._renderCal());
      this._calendar = this.cal.find('.calendar');
    }
    this._title.text(this._formatTitle(this.date));
    year = this.date.year();
    month = this.date.months();
    date = this.date.format(this.opts.format);
    this._year.val(year);
    this._month.val(month + 1);
    this._monthpicker.find('.datepicker-popover p').removeClass('selected');
    this._monthpicker.find("[data-value=" + year + "]").addClass('selected');
    this._monthpicker.find("[data-value=" + month + "]").addClass('selected');
    if (!this.opts.monthpicker) {
      return this._calendar.find("[data-date=" + date + "]").addClass('selected');
    }
  };

  Datepicker.prototype._renderCal = function() {
    var i, j, len, ref, week;
    week = '';
    ref = [1, 2, 3, 4, 5, 6, 0];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<table class=\"calendar\">\n  <tr class=\"datepicker-dow\">\n    " + week + "\n  </tr>\n  " + (this._renderDaySelectors()) + "\n</table>";
  };

  Datepicker.prototype._renderYearMonth = function() {
    return "<div class=\"datepicker-yearmonth\">\n  <div class=\"datepicker-year-container\">\n    <div class=\"input-wrapper\">\n      <input class=\"year-input\" data-type=\"year\"/>\n      <i class=\"icon-triangle-down\"><span>&#9660;</span></i>\n    </div>\n    " + (this._renderYearSelect()) + "\n    <span>" + (this._t('year')) + "</span>\n  </div>\n  <div class=\"datepicker-month-container\">\n    <div class=\"input-wrapper\">\n      <input class=\"month-input\" data-type=\"month\"/>\n      <i class=\"icon-triangle-down\"><span>&#9660;</span></i>\n    </div>\n    " + (this._renderMonthSelect()) + "\n    <span>" + (this._t('month')) + "</span>\n  </div>\n</div>";
  };

  Datepicker.prototype._renderYearSelect = function() {
    var currentYear;
    currentYear = moment().year();
    return "<div class=\"datepicker-popover\">\n  <p data-value=\"" + currentYear + "\">" + (this._t('currentYear')) + "</p>\n  <p data-value=\"" + (currentYear + 1) + "\">" + (this._t('nextYear')) + "</p>\n  <p data-value='" + (currentYear - 1) + "'>" + (this._t('lastYear')) + "</p>\n  <p data-value='" + (currentYear - 2) + "'>" + (this._t('beforeLastYear')) + "</p>\n</div>";
  };

  Datepicker.prototype._renderMonthSelect = function() {
    var el, j, month;
    el = '<div class="datepicker-popover">';
    for (month = j = 1; j <= 12; month = ++j) {
      el += "<p data-value='" + (month - 1) + "'>" + month + "</p>";
    }
    return el += "</div>";
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
    this.el.trigger('change').blur();
    return this.trigger('select', [this.date]);
  };

  Datepicker.prototype.setDate = function(date) {
    this.date = moment.isMoment(date) ? date : moment(date, this.opts.format);
    this._refresh();
    return this.el.val(this.date.format(this.opts.format));
  };

  Datepicker.prototype.getDate = function() {
    if (this.el.val()) {
      return this.date || (this.date = moment(this.el.val(), this.opts.format));
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
    var ref;
    if ((ref = this.cal) != null) {
      ref.remove();
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
