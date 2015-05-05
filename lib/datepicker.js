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
    this._bind();
    return this._year.focus();
  };

  Datepicker.prototype._bind = function() {
    this._bindMouse();
    return this._bindKey();
  };

  Datepicker.prototype._bindMouse = function() {
    this.cal.on('mousedown click', function() {
      return false;
    });
    this.cal.on('click', 'input', function(e) {
      return $(e.currentTarget).focus();
    });
    this.cal.on('focus', 'input', (function(_this) {
      return function(e) {
        var $input, type;
        $input = $(e.currentTarget);
        type = $input.data('type');
        return _this.setActive(type);
      };
    })(this));
    this.cal.on('click', '.panel-year p', (function(_this) {
      return function(e) {
        var $target, from, year;
        $target = $(e.currentTarget);
        year = $target.data('year');
        if (['prev', 'next'].indexOf(year) === -1) {
          _this.date.year(year);
          _this._refresh();
          return _this._month.focus();
        } else {
          from = _this._yearSelector.find('p').eq(0).data('year');
          from = year === 'prev' ? from - 10 : from + 10;
          _this._yearSelector.replaceWith(_this._renderYearSelector(from));
          _this._yearSelector = _this.cal.find('.panel-year');
          return _this._yearSelector.addClass('active');
        }
      };
    })(this));
    this.cal.on('click', '.panel-month p', (function(_this) {
      return function(e) {
        var $target, month;
        $target = $(e.currentTarget);
        month = $target.data('month');
        _this.date.month(month);
        if (!_this.opts.monthpicker) {
          _this._calendar.replaceWith(_this._renderCal());
          _this._calendar = _this.cal.find('.calendar');
        }
        _this._refresh();
        if (_this.opts.monthpicker) {
          _this._update();
          return _this._select();
        } else {
          return _this._day.focus();
        }
      };
    })(this));
    return this.cal.on('click', '.panel-day a', (function(_this) {
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
        _this._refresh();
        return _this._select();
      };
    })(this));
  };

  Datepicker.prototype._bindKey = function() {
    return this.cal.on('keydown', '.datepicker-header input', (function(_this) {
      return function(e) {
        var $input, $next, direction, key, max, min, type, value;
        key = e.which;
        $input = $(e.currentTarget);
        value = $input.val();
        $next = $input.next('input');
        type = $input.data('type');
        min = $input.data('min');
        max = $input.data('max');
        if (!max) {
          max = _this.date.endOf('month').date();
        }
        if (key === 9) {
          if ($next.length) {
            _this._update();
            $next.focus();
          } else {
            _this._update();
            _this._select();
          }
        } else if (key === 13) {
          _this._update();
          _this._select();
        } else if (key === 38 || key === 40) {
          direction = key === 38 ? 1 : -1;
          value = Number(value) + direction;
          if (value < min) {
            value = max;
          }
          if (value > max) {
            value = min;
          }
          $input.val(value);
        } else if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(key !== -1)) {
          switch (type) {
            case 'year':
              if (value.length === 4) {
                value = value.substr(1);
              }
              break;
            case 'month':
              if (Number(value) * 10 + key - 48 > max) {
                value = value.substr(1);
              }
              if (Number(value) * 10 + key - 48 > max) {
                value = value.substr(1);
              }
              break;
            case 'day':
              if (Number(value) * 10 + key - 48 > max) {
                value = value.substr(1);
              }
              if (Number(value) * 10 + key - 48 > max) {
                value = value.substr(1);
              }
          }
          $input.val(value);
          return;
        }
        return e.preventDefault();
      };
    })(this));
  };

  Datepicker.prototype._update = function() {
    var day, month, year;
    year = this._year.val();
    month = Number(this._month.val()) - 1;
    day = this._day.val();
    if (year) {
      this.date.year(year);
    }
    if (month) {
      this.date.month(month);
    }
    if (day) {
      this.date.date(day);
    }
    if (!this.opts.monthpicker) {
      this._calendar.replaceWith(this._renderCal());
      return this._calendar = this.cal.find('.calendar');
    }
  };

  Datepicker.prototype._refresh = function() {
    this._year.val(this.date.year());
    this._month.val(this.date.month() + 1);
    if (!this.opts.monthpicker) {
      return this._day.val(this.date.date());
    }
  };

  Datepicker.prototype._select = function() {
    this.el.val(this.date.format(this.opts.format));
    this.el.trigger('change').blur();
    this.trigger('select', [this.date]);
    if (!this.opts.inline) {
      return this._hide();
    }
  };

  Datepicker.prototype._hide = function() {
    if (this.cal) {
      this.cal.remove();
      return this.cal = null;
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
    return "<table class=\"calendar panel panel-day\">\n  <tr class=\"datepicker-dow\">\n    " + week + "\n  </tr>\n  " + (this._renderDaySelectors()) + "\n</table>";
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

  Datepicker.prototype._renderPanel = function() {
    var _calTemplate;
    _calTemplate = "<div class=\"simple-datepicker\">\n  <div class=\"datepicker-header\">\n    <input type=\"text\" class=\"year-input\" data-type='year' data-min=\"1800\" data-max=\"3000\"/>\n    <input type=\"text\" class=\"month-input\" data-type='month' data-min=\"1\" data-max=\"12\"/>\n    <input type=\"text\" class=\"day-input\" data-type='day' data-min=\"1\"/>\n  </div>\n  <div class=\"datepicker-selector\">\n  </div>\n</div>";
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
    this._selectors = this.cal.find('.datepicker-selector');
    this._selectors.append(this._renderYearSelector());
    this._selectors.append(this._renderMonthSelector());
    if (!this.opts.monthpicker) {
      this._selectors.append(this._renderCal());
    }
    this._calendar = this.cal.find('.calendar');
    this._yearSelector = this.cal.find('.panel-year');
    this._monthSelector = this.cal.find('.panel-month');
    this._year = this.cal.find('.year-input');
    this._month = this.cal.find('.month-input');
    this._day = this.cal.find('.day-input');
    this._year.val(this.date.year());
    this._month.val(this.date.month() + 1);
    this._day.val(this.date.date());
    if (this.opts.monthpicker) {
      this._calendar.remove();
      return this.cal.find('.day-input').remove();
    } else {
      return this._calendar.find("[data-date=" + (this.date.format('YYYY-MM-DD')) + "]").addClass('selected');
    }
  };

  Datepicker.prototype._renderYearSelector = function(from) {
    var el, j, ref, ref1, year;
    if (!from) {
      from = Math.floor(moment().year() / 10) * 10;
    }
    el = '<div class="panel panel-year">';
    for (year = j = ref = from, ref1 = from + 9; ref <= ref1 ? j <= ref1 : j >= ref1; year = ref <= ref1 ? ++j : --j) {
      el += "<p class='datepicker-year' data-year='" + year + "'>" + year + "</p>";
    }
    el += '<p class="datepicker-year" data-year="prev"><</p><p class="datepicker-year" data-year="next">></p>';
    return el += '</div>';
  };

  Datepicker.prototype._renderMonthSelector = function() {
    var el, j, month;
    el = '<div class="panel panel-month">';
    for (month = j = 1; j <= 12; month = ++j) {
      el += "<p class='datepicker-month' data-month='" + (month - 1) + "'>" + month + "</p>";
    }
    return el += '</div>';
  };

  Datepicker.prototype.setActive = function(type) {
    this.cal.find('.panel').removeClass('active');
    return this.cal.find(".panel-" + type).addClass('active');
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
