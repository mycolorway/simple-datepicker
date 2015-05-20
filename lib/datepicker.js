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
    width: null,
    date: {
      disableBefore: null,
      disableAfter: null
    }
  };

  Datepicker.addView = function(view) {
    if (!this.panel) {
      this.panel = [];
    }
    return this.panel[view.prototype.name] = view;
  };

  Datepicker.prototype._init = function() {
    var val;
    this.panels = [];
    this.list = [];
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple datepicker: option el is required';
      return;
    }
    if (this.opts.monthpicker) {
      this.opts.format = 'YYYY-MM';
    }
    this.el.data('datepicker', this);
    val = this.el.val() || moment().startOf(this.opts.monthpicker ? 'month' : 'day');
    this.date = moment.isMoment(val) ? val : moment(val, this.opts.format);
    this._render();
    return this._bind();
  };

  Datepicker.prototype._render = function() {
    var tpl;
    tpl = '<div class="simple-datepicker">\n  <div class="datepicker-header">\n  </div>\n  <div class="datepicker-panels">\n  </div>\n</div>';
    this.picker = $(tpl);
    this._header = this.picker.find('.datepicker-header');
    this._panel = this.picker.find('.datepicker-panels');
    this._renderPanels();
    if (this.opts.inline) {
      this.picker.insertAfter(this.el);
      return this.show();
    } else {
      this.picker.appendTo('body');
      return this._setPosition();
    }
  };

  Datepicker.prototype._renderPanels = function() {
    var i, len, name, opt, ref, results;
    ref = this.opts.list;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      if (name.indexOf('%') === -1) {
        opt = {
          el: this
        };
        if (this.opts[name]) {
          $.extend(opt, this.opts[name]);
        }
        this.panels[name] = new this.constructor.panel[name](opt);
        results.push(this.list.push(name));
      } else {
        results.push(this._header.append("<span>" + (name.substr(1)) + "</span>"));
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
    if (!this.opts.inline) {
      this.el.on('focus', (function(_this) {
        return function(e) {
          return _this.show();
        };
      })(this));
      $(document).on("click.datepicker", (function(_this) {
        return function(e) {
          if (!(_this.el.is(e.target) || _this.picker.has(e.target).length)) {
            return _this.hide();
          }
        };
      })(this));
    }
    this.on('finish', (function(_this) {
      return function(e, event) {
        var completed, index, nextPanel, panel;
        panel = event.panel;
        completed = event.completed;
        index = _this.list.indexOf(panel);
        if (completed || index === _this.list.length - 1) {
          return _this._selectDate();
        } else {
          _this.trigger('refresh', {
            source: panel
          });
          nextPanel = _this.list[index + 1];
          _this.panels[panel].setActive(false);
          return _this.panels[nextPanel].setActive(true);
        }
      };
    })(this));
    this.on('refresh', (function(_this) {
      return function(e, event) {
        var source;
        source = event.source;
        switch (source) {
          case 'year':
            if (_this.panels['date']) {
              return _this.panels['date'].refreshView();
            }
            break;
          case 'month':
            if (_this.panels['date']) {
              return _this.panels['date'].refreshView();
            }
            break;
          case 'date':
            if (_this.panels['year']) {
              _this.panels['year'].refreshInput();
              _this.panels['year'].refreshView();
            }
            if (_this.panels['month']) {
              _this.panels['month'].refreshInput();
              return _this.panels['month'].refreshView();
            }
        }
      };
    })(this));
    this.on('panelchange', (function(_this) {
      return function(e, event) {
        var i, len, panel, ref, results;
        ref = _this.list;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          panel = ref[i];
          if (panel !== event.panel) {
            results.push(_this.panels[panel].setActive(false));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this));
    return this.on('close', (function(_this) {
      return function(e) {
        var i, len, panel, ref;
        ref = _this.list;
        for (i = 0, len = ref.length; i < len; i++) {
          panel = ref[i];
          _this.panels[panel].setActive(false);
        }
        return _this.hide();
      };
    })(this));
  };

  Datepicker.prototype.setDate = function(date) {};

  Datepicker.prototype._selectDate = function() {
    this.el.val(this.date.format(this.opts.format));
    this.el.trigger('change').blur();
    this.trigger('select', [this.date]);
    if (!this.opts.inline) {
      return this.hide();
    }
  };

  Datepicker.prototype.show = function() {
    this.picker.show();
    return this.panels[this.list[0]].setActive();
  };

  Datepicker.prototype.hide = function() {
    return this.picker.hide();
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
    el: null
  };

  View.prototype._itemTpl = '<a class="panel-item"></a>';

  View.prototype._inputTpl = '<input/>';

  View.prototype._panelTpl = '<div class="panel"></div>';

  View.prototype._init = function() {
    this._header = this.opts.el._header;
    this._panel = this.opts.el._panel;
    this._picker = this.opts.el;
    this.date = this.opts.el.date;
    this._render();
    this._bindPanel();
    this._bindInput();
    return this._prepareAction();
  };

  View.prototype._render = function() {
    this.input = $(this._renderInput());
    this.panel = $(this._renderPanel());
    $(this._header).append(this.input);
    return $(this._panel).append(this.panel);
  };

  View.prototype._bindPanel = function() {
    return this.panel.on('click', 'a', (function(_this) {
      return function(e) {
        return _this._onClickHandler(e);
      };
    })(this));
  };

  View.prototype._bindInput = function() {
    this.input.off('focus').on('focus', (function(_this) {
      return function() {
        _this.panel.addClass('active');
        return _this._picker.trigger('panelchange', {
          panel: _this.name
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

  View.prototype._onClickHandler = function(e) {
    var $target, action, value;
    $target = $(e.currentTarget);
    value = $target.data('value');
    if (value) {
      this.date.set(this.name, value);
      this.panel.find('a.selected').removeClass('selected');
      this.panel.find("a[data-value=" + value + "]").addClass('selected');
      this.refreshInput();
      return this._picker.trigger('finish', {
        panel: this.name,
        value: value
      });
    } else {
      action = $target.data('action');
      return this.action[action](action);
    }
  };

  View.prototype._onKeydownHandler = function(e) {
    var direction, key, max, min, type, value;
    key = e.which;
    value = this.input.val();
    type = this.input.data('type');
    min = this.input.data('min');
    max = this.input.data('max');
    if (!max) {
      max = this.date.endOf('month').date();
    }
    if (key === 9) {
      this.date.set(this.name, value);
      this.refreshView();
      this._picker.trigger('finish', {
        panel: this.name
      });
    } else if (key === 13) {
      this.date.set(this.name, value);
      this._picker.trigger('finish', {
        panel: this.name,
        completed: true
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
      this.input.val(value);
      this.date.set(this.name, value);
      this._picker.trigger('refresh', {
        source: this.name
      });
    } else if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(key) !== -1) {
      return;
    } else if ([8, 46, 37, 39].indexOf(key) !== -1) {
      return;
    } else if (key === 27) {
      this._picker.trigger('close');
    }
    return e.preventDefault();
  };

  View.prototype._onInputHandler = function(e) {};

  View.prototype._prepareAction = function() {};

  View.prototype._renderInput = function() {
    return this._inputTpl;
  };

  View.prototype._renderPanel = function() {
    return this._panelTpl;
  };

  View.prototype._reRenderPanel = function(opt) {
    this.panel.replaceWith($(this._renderPanel(opt)));
    this.panel = this._panel.find(".panel-" + this.name);
    return this._bindPanel();
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

  View.prototype.refreshInput = function() {
    var value;
    value = this.date.get(this.name);
    return this.input.val(value);
  };

  View.prototype.refreshView = function() {
    this.panel.find('a.selected').removeClass('selected');
    return this.panel.find("a[data-value=" + (this.date.get(this.name)) + "]").addClass('selected');
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

  DateView.prototype.opts = {
    el: null,
    disableBefore: null,
    disableAfter: null
  };

  DateView.prototype._inputTpl = '<input type="text" class="date-input" data-type="date" data-min="1"/>';

  DateView.prototype._renderPanel = function() {
    var i, j, len, ref, week;
    week = '';
    ref = [1, 2, 3, 4, 5, 6, 0];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<div class=\"panel panel-date\">\n  <div class=\"calendar-menu\">\n    " + (this._renderDayMenu()) + "\n  </div>\n  <table class=\"calendar\" data-month=\"" + (this.date.format('YYYY-MM')) + "\">\n    <tr class=\"datepicker-dow\">\n      " + week + "\n    </tr>\n    " + (this._renderDaySelectors()) + "\n  </table>\n</div>";
  };

  DateView.prototype._renderDayMenu = function() {
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-left\"><span>&gt;</span></i></a>";
  };

  DateView.prototype._renderDaySelectors = function() {
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
        row += "<td class='datepicker-day'>\n  <a href=\"javascript:;\" class=\"" + c + "\" data-value=\"" + (date.get('date')) + "\">\n    " + n + "\n  </a>\n</td>";
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

  DateView.prototype._prepareAction = function() {
    var f;
    this.action = [];
    f = (function(_this) {
      return function(action) {
        var direction;
        direction = action === 'prev' ? -1 : 1;
        _this.date.add(direction, 'month');
        _this._reRenderPanel();
        _this.panel.addClass('active');
        return _this._picker.trigger('refresh', {
          source: 'date'
        });
      };
    })(this);
    this.action['prev'] = f;
    return this.action['next'] = f;
  };

  DateView.prototype._onInputHandler = function() {
    var max, value;
    value = this.input.val();
    max = this.date.endOf('month').date();
    if (Number(value) > max) {
      return this.input.val(value.substr(1));
    } else if (value.length === 2 && Number(value) > 0 && Number(value) < max) {
      this.date.set('date', value);
      this.refreshView();
      this.panel.find('a.selected').removeClass('selected');
      this.panel.find("a[data-value=" + value + "]").addClass('selected');
      return this._picker.trigger('finish', {
        panel: 'date'
      });
    }
  };

  DateView.prototype.refresh = function() {
    this.panel.find('a.selected').removeClass('selected');
    if (this.panel.find('table.calendar').data('month') === this.date.format('YYYY-MM')) {
      return this.panel.find("a[data-value=" + (this.date.get('date')) + "]").addClass('selected');
    }
  };

  DateView.prototype.refreshView = function() {
    if (this.panel.find('table.calendar').data('month') === this.date.format('YYYY-MM')) {
      return;
    }
    return this._reRenderPanel();
  };

  DateView.prototype.setActive = function(active) {
    DateView.__super__.setActive.call(this, active);
    if (active) {
      this.refreshView();
      return this.panel.addClass('active');
    }
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
    for (month = i = 0; i <= 11; month = ++i) {
      el += "<a class='panel-item' data-value='" + month + "'>" + (month + 1) + "</a>";
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
      this.date.set('month', Number(value) - 1);
      this.refreshView();
      return this._picker.trigger('finish', {
        panel: 'month'
      });
    }
  };

  MonthView.prototype.refreshInput = function() {
    var value;
    value = this.date.get('month');
    return this.input.val(value + 1);
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

  YearView.prototype._renderPanel = function(from) {
    var el;
    if (!from) {
      from = Math.floor(this.date.year() / 10) * 10;
    }
    return el = "<div class=\"panel panel-year\">\n  " + (this._renderYears(from)) + "\n</div>";
  };

  YearView.prototype._renderYears = function(from) {
    var el, i, ref, ref1, year;
    el = '<a class="panel-item menu" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a><a class="panel-item menu" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>';
    for (year = i = ref = from, ref1 = from + 11; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
      el += "<a class='panel-item' data-value='" + year + "'>" + year + "</a>";
    }
    return el;
  };

  YearView.prototype._prepareAction = function() {
    var f;
    this.action = [];
    f = (function(_this) {
      return function(action) {
        var from;
        from = _this.panel.find('.panel-item:not(.menu)').eq(0).data('value');
        from = action === 'prev' ? from - 10 : from + 10;
        _this._reRenderPanel(from);
        return _this.panel.addClass('active');
      };
    })(this);
    this.action['prev'] = f;
    return this.action['next'] = f;
  };

  YearView.prototype._onInputHandler = function() {
    var value;
    value = this.input.val();
    if (value.length > 4) {
      this.input.val(value.substr(1));
    }
    value = this.input.val();
    if (value > 1900 && value < 2050) {
      this.date.set('year', value);
      this.refreshView();
      return this._picker.trigger('finish', {
        panel: 'year'
      });
    }
  };

  YearView._reRenderPanel = function() {
    var from, newFrom;
    newFrom = Math.floor(this.date.year() / 10) * 10;
    from = this.panel.find('.panel-item:not(.menu)').eq(0).data('value');
    if (newFrom === from) {
      return;
    }
    return YearView.__super__.constructor._reRenderPanel.call(this);
  };

  YearView.prototype.refreshView = function() {
    this._reRenderPanel();
    return YearView.__super__.refreshView.call(this);
  };

  return YearView;

})(View);

Datepicker.addView(YearView);

return datepicker;

}));
