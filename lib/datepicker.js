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
    list: ['year', '%-', 'month', '%-', 'date'],
    el: null,
    inline: false,
    format: 'YYYY-MM-DD',
    defaultView: 'auto',
    viewOpts: {
      date: {
        disableBefore: null,
        disableAfter: null
      }
    }
  };

  Datepicker.addView = function(view) {
    if (!this.views) {
      this.views = [];
    }
    return this.views[view.prototype.name] = view;
  };

  Datepicker.prototype._init = function() {
    var val;
    this.view = [];
    this.viewList = [];
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple datepicker: option el is required';
      return;
    }
    this.el.data('datepicker', this);
    val = this.el.val() || moment();
    this.date = moment.isMoment(val) ? val : moment(val, this.opts.format);
    this._render();
    return this._bind();
  };

  Datepicker.prototype._render = function() {
    var tpl;
    tpl = '<div class="simple-datepicker">\n  <div class="datepicker-header">\n  </div>\n  <div class="datepicker-panels">\n  </div>\n</div>';
    this.picker = $(tpl);
    this.headerContainer = this.picker.find('.datepicker-header');
    this.panelContainer = this.picker.find('.datepicker-panels');
    this._renderViews();
    if (this.opts.inline) {
      this.picker.insertAfter(this.el);
      return this.show();
    } else {
      this.picker.appendTo('body');
      return this._setPosition();
    }
  };

  Datepicker.prototype._renderViews = function() {
    var i, len, name, opt, ref, results;
    ref = this.opts.list;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      if (name.indexOf('%') === -1) {
        opt = {
          parent: this,
          inputContainer: this.headerContainer,
          panelContainer: this.panelContainer
        };
        opt.defaultValue = (function() {
          switch (name) {
            case 'year':
              return this.date.year();
            case 'month':
              return this.date.month() + 1;
            case 'date':
              return this.date.format('YYYY-MM-DD');
          }
        }).call(this);
        if (this.opts['viewOpts'][name]) {
          $.extend(opt, this.opts['viewOpts'][name]);
        }
        this.view[name] = new this.constructor.views[name](opt);
        this.viewList.push(name);
        results.push(this._bindView(this.view[name]));
      } else {
        results.push(this.headerContainer.append("<span>" + (name.substr(1)) + "</span>"));
      }
    }
    return results;
  };

  Datepicker.prototype._setPosition = function() {
    var offset;
    offset = this.el.offset();
    return this.picker.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.el.outerHeight(true)
    });
  };

  Datepicker.prototype._bind = function() {
    if (this.opts.inline) {
      return;
    }
    this.el.on('focus.datepicker', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this));
    return $(document).on('click.datepicker', (function(_this) {
      return function(e) {
        if (_this.el.is(e.target)) {
          return;
        }
        if ($(e.target).parentsUntil(_this.picker).length) {
          return;
        }
        if (_this.picker.is(e.target)) {
          return;
        }
        return _this.hide();
      };
    })(this));
  };

  Datepicker.prototype._bindView = function(view) {
    view.on('select', (function(_this) {
      return function(e, event) {
        var index, newDate, ref, source;
        source = event.source;
        newDate = event.value;
        if (newDate.year) {
          _this.date.year(newDate.year);
        }
        if (newDate.month) {
          _this.date.month(newDate.month - 1);
        }
        if (newDate.date) {
          _this.date = moment(newDate.date);
          _this.view['year'].trigger('datechange', {
            year: _this.date.year()
          });
          _this.view['month'].trigger('datechange', {
            month: _this.date.month() + 1
          });
        }
        switch (source) {
          case 'year':
          case 'month':
            if ((ref = _this.view['date']) != null) {
              ref.trigger('datechange', {
                year: _this.date.year(),
                month: _this.date.month() + 1
              });
            }
            break;
          case 'date':
            _this.view['year'].trigger('datechange', {
              year: _this.date.year()
            });
            _this.view['month'].trigger('datechange', {
              month: _this.date.month() + 1
            });
        }
        if (event.finished) {
          index = _this.viewList.indexOf(source);
          if (index === _this.viewList.length - 1) {
            return _this._selectDate();
          } else {
            return _this.view[_this.viewList[index + 1]].setActive();
          }
        }
      };
    })(this));
    view.on('showpanel', (function(_this) {
      return function(e, event) {
        var i, index, len, name, ref, results, source;
        source = event.source;
        if (event.prev) {
          _this.view[source].setActive(false);
          index = _this.viewList.indexOf(source) - 1;
          if (index < 0) {
            index = 0;
          }
          return _this.view[_this.viewList[index]].setActive();
        } else {
          ref = _this.viewList;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            name = ref[i];
            if (name !== source) {
              results.push(_this.view[name].setActive(false));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
    })(this));
    return view.on('close', (function(_this) {
      return function(e, event) {
        if (event != null ? event.selected : void 0) {
          _this._selectDate();
        }
        if (!_this.opts.inline) {
          return _this.hide();
        }
      };
    })(this));
  };

  Datepicker.prototype._selectDate = function() {
    this.el.val(this.date.format(this.opts.format));
    this.el.trigger('change').blur();
    this.trigger('select', [this.date]);
    if (!this.opts.inline) {
      return this.hide();
    }
  };

  Datepicker.prototype.setDate = function(date) {
    var ref, ref1, ref2;
    this.date = moment.isMoment(date) ? date : moment(date, this.opts.format);
    this.el.val(this.date.format(this.opts.format));
    if ((ref = this.view['year']) != null) {
      ref.trigger('datechange', {
        year: this.date.year()
      });
    }
    if ((ref1 = this.view['month']) != null) {
      ref1.trigger('datechange', {
        month: this.date.month() + 1
      });
    }
    return (ref2 = this.view['date']) != null ? ref2.trigger('datechange', {
      year: this.date.year(),
      month: this.date.month() + 1,
      date: this.date.format('YYYY-MM-DD')
    }) : void 0;
  };

  Datepicker.prototype.clear = function() {
    var i, len, name, ref, results;
    this.el.val('');
    this.date = moment();
    ref = this.viewList;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      results.push(this.view[name].clear());
    }
    return results;
  };

  Datepicker.prototype.getDate = function() {
    if (this.el.val()) {
      return this.date || (this.date = moment(this.el.val(), this.opts.format));
    } else {
      return null;
    }
  };

  Datepicker.prototype.show = function() {
    var view;
    this.picker.show();
    view = this.opts.defaultView;
    if (this.viewList.indexOf(view) !== -1) {
      return this.view[view].setActive();
    } else {
      if (this.el.val() !== '' && this.view['date']) {
        return this.view['date'].setActive();
      } else {
        return this.view[this.viewList[0]].setActive();
      }
    }
  };

  Datepicker.prototype.hide = function() {
    return this.picker.hide();
  };

  Datepicker.prototype.destroy = function() {
    var ref;
    if ((ref = this.picker) != null) {
      ref.remove();
    }
    this.picker = null;
    this.el.off('.datepicker');
    return $(document).off('.datepicker');
  };

  return Datepicker;

})(SimpleModule);

datepicker = function(opts) {
  return new Datepicker(opts);
};

var View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = (function(superClass) {
  extend(View, superClass);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.opts = {
    parent: null,
    inputContainer: null,
    panelContainer: null
  };

  View.prototype.name = '';

  View.prototype.value = 0;

  View.prototype._inputTpl = '<input class="input"/>';

  View.prototype._panelTpl = '<div class="panel"></div>';

  View.prototype._init = function() {
    this.parent = $(this.opts.parent);
    this.inputContainer = $(this.opts.inputContainer);
    this.panelContainer = $(this.opts.panelContainer);
    this.value = this.opts.defaultValue;
    this._render();
    this._bindInput();
    this._bindPanel();
    return this._bindView();
  };

  View.prototype._render = function() {
    this.input = $(this._renderInput());
    this.panel = $(this._renderPanel());
    this.inputContainer.append(this.input);
    this.panelContainer.append(this.panel);
    this._refreshSelected();
    return this._refreshInput();
  };

  View.prototype._bindInput = function() {
    this.input.off('focus').on('focus', (function(_this) {
      return function() {
        _this.panel.addClass('active');
        return _this.trigger('showpanel', {
          source: _this.name
        });
      };
    })(this));
    this.input.on('keydown', (function(_this) {
      return function(e) {
        return _this._onKeydownHandler(e);
      };
    })(this));
    return this.input.on('input', (function(_this) {
      return function(e) {
        return _this._onInputHandler(e);
      };
    })(this));
  };

  View.prototype._onKeydownHandler = function(e) {
    var direction, key, max, min, type, value;
    key = e.which;
    value = this.input.val();
    type = this.input.data('type');
    min = this.input.data('min');
    max = this.input.data('max');
    if (key === 9) {
      if (e.shiftKey) {
        this.trigger('showpanel', {
          source: this.name,
          prev: true
        });
      } else {
        this.select(value, false, true);
      }
    } else if (key === 13) {
      this.select(value, false, false);
      this.trigger('close', {
        selected: true
      });
    } else if (key === 38 || key === 40) {
      direction = key === 38 ? 1 : -1;
      value = Number(value) + direction;
      if (value < min) {
        value = max;
      }
      if (value > max) {
        value = min;
      }
      this.select(value, true, false);
    } else if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(key) !== -1) {
      return;
    } else if ([8, 46, 37, 39].indexOf(key) !== -1) {
      return;
    } else if (key === 27) {
      this.trigger('close');
    }
    return e.preventDefault();
  };

  View.prototype._onInputHandler = function() {};

  View.prototype._bindPanel = function() {
    return this.panel.on('click', 'a', (function(_this) {
      return function(e) {
        return _this._onClickHandler(e);
      };
    })(this));
  };

  View.prototype._onClickHandler = function(e) {
    var $target, action, value;
    e.preventDefault();
    $target = $(e.currentTarget);
    value = $target.data('value');
    if (value) {
      return this.select(value, true, true);
    } else {
      action = $target.data('action');
      return this._handleAction(action);
    }
  };

  View.prototype._handleAction = function() {};

  View.prototype._bindView = function() {
    return this.on('datechange', (function(_this) {
      return function(e, event) {
        return _this._onDateChangeHandler(event);
      };
    })(this));
  };

  View.prototype._onDateChangeHandler = function() {};

  View.prototype._renderInput = function() {
    return this._inputTpl;
  };

  View.prototype._renderPanel = function() {
    return this._panelTpl;
  };

  View.prototype._reRenderPanel = function(opt) {
    var active;
    if (this.panel.is('.active')) {
      active = true;
    }
    this.panel.replaceWith($(this._renderPanel(opt)));
    this.panel = this.panelContainer.find(".panel-" + this.name);
    if (active) {
      this.panel.addClass('active');
    }
    this._refreshSelected();
    return this._bindPanel();
  };

  View.prototype._refreshSelected = function() {
    this.panel.find('a.selected').removeClass('selected');
    return this.panel.find("a[data-value='" + this.value + "']").addClass('selected');
  };

  View.prototype._refreshInput = function() {
    return this.input.val(this.value);
  };

  View.prototype.select = function(value, refreshInput, finished) {
    var obj;
    this.value = value;
    this._refreshSelected();
    if (refreshInput) {
      this._refreshInput();
    }
    return this.triggerHandler('select', {
      source: this.name,
      value: (
        obj = {},
        obj["" + this.name] = value,
        obj
      ),
      finished: finished
    });
  };

  View.prototype.setActive = function(active) {
    if (active == null) {
      active = true;
    }
    if (active) {
      return this.input.focus();
    } else {
      return this.panel.removeClass('active');
    }
  };

  View.prototype.clear = function() {
    this.value = 0;
    return this.input.val('');
  };

  return View;

})(SimpleModule);

var DateView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DateView = (function(superClass) {
  extend(DateView, superClass);

  function DateView() {
    return DateView.__super__.constructor.apply(this, arguments);
  }

  DateView.prototype.name = 'date';

  DateView.prototype.currentMonth = moment().format('YYYY-MM');

  DateView.prototype.opts = {
    el: null,
    disableBefore: null,
    disableAfter: null
  };

  DateView.prototype.value = moment().format('YYYY-MM-DD');

  DateView.prototype._inputTpl = '<input type="text" class="date-input" data-type="date" data-min="1"/>';

  DateView.prototype._renderPanel = function() {
    var i, j, len, ref, week;
    week = '';
    ref = [1, 2, 3, 4, 5, 6, 0];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<div class=\"panel panel-date\">\n  <div class=\"calendar-menu\">\n    " + (this._renderDayMenu()) + "\n  </div>\n  <table class=\"calendar\"\">\n    <tr class=\"datepicker-dow\">\n      " + week + "\n    </tr>\n    " + (this._renderDaySelectors()) + "\n  </table>\n</div>";
  };

  DateView.prototype._renderDayMenu = function() {
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-left\"><span>&gt;</span></i></a>";
  };

  DateView.prototype._renderDaySelectors = function() {
    var c, date, days, firstDate, i, lastDate, n, p, prevLastDate, row, tmpDate, today, until_, x, y;
    today = moment().startOf("day");
    tmpDate = moment(this.currentMonth, 'YYYY-MM');
    this.input.attr({
      'data-max': tmpDate.endOf('month').date()
    });
    firstDate = tmpDate.clone().startOf("month");
    lastDate = tmpDate.clone().endOf("month");
    prevLastDate = tmpDate.clone().add(-1, "months").endOf("month");
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
        date = tmpDate.clone().date(n);
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
        row += "<td class='datepicker-day'>\n  <a href=\"javascript:;\" class=\"" + c + "\" data-value=\"" + (date.format('YYYY-MM-DD')) + "\">\n    " + n + "\n  </a>\n</td>";
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

  DateView.prototype._onInputHandler = function() {
    var max, value;
    value = this.input.val();
    max = moment(this.currentMonth).endOf('month').date();
    if (Number(value) > max) {
      return this.input.val(value.substr(1));
    } else if (value.length === 2 && Number(value) > 0 && Number(value) < max) {
      return this.select(value, false, true);
    }
  };

  DateView.prototype._handleAction = function(action) {
    var direction, tmpDate;
    tmpDate = moment(this.currentMonth, 'YYYY-MM');
    direction = action === 'prev' ? -1 : 1;
    tmpDate.add(direction, 'month');
    this.currentMonth = tmpDate.format('YYYY-MM');
    this.triggerHandler('select', {
      source: 'date',
      value: {
        year: tmpDate.year(),
        month: tmpDate.month() + 1
      },
      finished: false
    });
    this._reRenderPanel();
    return this.panel.addClass('active');
  };

  DateView.prototype._refreshInput = function() {
    var date;
    date = moment(this.value).date();
    return this.input.val(date);
  };

  DateView.prototype._onDateChangeHandler = function(e) {
    var newMonth;
    newMonth = moment().year(e.year).month(e.month - 1).format('YYYY-MM');
    if (e.date) {
      this.value = e.date;
      this._refreshSelected();
      this._refreshInput();
    }
    if (newMonth === this.currentMonth) {
      return;
    }
    this.currentMonth = newMonth;
    return this._reRenderPanel();
  };

  DateView.prototype.select = function(value, refreshInput, finished) {
    if (!(value.toString().length > 2)) {
      value = moment(this.currentMonth, 'YYYY-MM').date(value).format('YYYY-MM-DD');
    }
    return DateView.__super__.select.call(this, value, refreshInput, finished);
  };

  return DateView;

})(View);

Datepicker.addView(DateView);

var MonthView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MonthView = (function(superClass) {
  extend(MonthView, superClass);

  function MonthView() {
    return MonthView.__super__.constructor.apply(this, arguments);
  }

  MonthView.prototype.name = 'month';

  MonthView.prototype._inputTpl = '<input type="text" class="month-input" data-type="month" data-min="1" data-max="12"/>';

  MonthView.prototype._renderPanel = function() {
    var el, i, month;
    el = '';
    for (month = i = 1; i <= 12; month = ++i) {
      el += "<a class='panel-item' data-value='" + month + "'>" + month + "</a>";
    }
    return $(this._panelTpl).html(el).addClass('panel-month');
  };

  MonthView.prototype._onInputHandler = function() {
    var value;
    while (Number(this.input.val()) > 12) {
      this.input.val(this.input.val().substr(1));
    }
    value = this.input.val();
    if (value.length === 2) {
      return this.select(value, false, true);
    }
  };

  MonthView.prototype._onDateChangeHandler = function(e) {
    this.value = e.month;
    this._refreshInput();
    return this._refreshSelected();
  };

  return MonthView;

})(View);

Datepicker.addView(MonthView);

var YearView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

YearView = (function(superClass) {
  extend(YearView, superClass);

  function YearView() {
    return YearView.__super__.constructor.apply(this, arguments);
  }

  YearView.prototype.name = 'year';

  YearView.prototype._inputTpl = '<input type="text" class="year-input" data-type="year" data-min="1800" data-max="3000"/>';

  YearView.prototype.firstYear = 0;

  YearView.prototype._renderPanel = function() {
    var el;
    if (this.firstYear === 0) {
      this.firstYear = Math.floor(this.value / 10) * 10;
    }
    return el = "<div class=\"panel panel-year\">\n  " + (this._renderYears(this.firstYear)) + "\n</div>";
  };

  YearView.prototype._renderYears = function(firstYear) {
    var el, i, ref, ref1, year;
    el = '<a class="panel-item menu" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a><a class="panel-item menu" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>';
    for (year = i = ref = firstYear, ref1 = firstYear + 11; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
      el += "<a class='panel-item' data-value='" + year + "'>" + year + "</a>";
    }
    return el;
  };

  YearView.prototype._handleAction = function(action) {
    this.firstYear = action === 'prev' ? this.firstYear - 10 : this.firstYear + 10;
    this._reRenderPanel();
    return this.panel.addClass('active');
  };

  YearView.prototype._onInputHandler = function() {
    var value;
    value = this.input.val();
    if (value.length > 4) {
      this.input.val(value.substr(1));
    }
    value = this.input.val();
    if (value > 1900 && value < 2050) {
      return this.select(value, false, true);
    }
  };

  YearView.prototype._onDateChangeHandler = function(event) {
    var newFirstYear;
    this.value = event.year;
    newFirstYear = Math.floor(this.value / 10) * 10;
    if (this.firstYear === newFirstYear) {
      this._refreshInput();
      return this._refreshSelected();
    } else {
      this.firstYear = newFirstYear;
      return this._reRenderPanel();
    }
  };

  YearView.prototype.select = function(value, refreshInput, finished) {
    var newFirstYear;
    newFirstYear = Math.floor(this.value / 10) * 10;
    if (this.firstYear !== newFirstYear) {
      this.firstYear = newFirstYear;
      this._reRenderPanel();
    }
    return YearView.__super__.select.call(this, value, refreshInput, finished);
  };

  return YearView;

})(View);

Datepicker.addView(YearView);

return datepicker;

}));
