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
    disableBefore: null,
    disableAfter: null,
    format: "YYYY-MM-DD",
    width: null,
    month: null
  };

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

  Datepicker.prototype.update = function(date) {
    var calendar, offset, theDate, today;
    today = moment().startOf("day");
    theDate = date || this.el.data("theDate") || this.selectedDate || today;
    this.el.data("theDate", theDate);
    calendar = this._renderCal(theDate);
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
      }).on("click", ".datepicker-prev a", (function(_this) {
        return function(e) {
          var btn, newDate;
          btn = $(e.currentTarget);
          date = _this.el.data("theDate");
          newDate = date.clone().add("months", -1);
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
          return _this.cal.trigger("select", [date.format(_this.opts.format), btn]);
        };
      })(this));
    }
    if (this.opts.width) {
      this.cal.css("width", this.opts.width);
    }
    this.cal.html(calendar);
    return this.cal.trigger("beforeUpdate", [this.cal]);
  };

  Datepicker.prototype._renderCal = function(theDate) {
    var c, calendar, date, days, firstDate, i, lastDate, monthNames, n, p, prevLastDate, row, showN, showP, titleMonthYear, today, until_, x, y;
    today = moment().startOf("day");
    firstDate = theDate.clone().startOf("month");
    lastDate = theDate.clone().endOf("month");
    prevLastDate = theDate.clone().add("months", -1).endOf("month");
    monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
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
        row += "<td class='datepicker-day'><a href='javascript:;' class='" + c + "' data-date='" + date.format("YYYY-MM-DD") + "'>" + n + "</div></td>";
        x++;
        i++;
      }
      if (row) {
        days += "<tr class='days'>" + row + "</tr>";
      }
      y++;
    }
    showP = showN = true;
    if (!this.opts.showPrevNext) {
      showP = showN = false;
    }
    titleMonthYear = theDate.year() + "年" + monthNames[theDate.month()];
    calendar = "<table class='calendar'>" + "<tr>" + "<td class='datepicker-prev'>" + (showP ? "<a href='javascript:;' class='fa fa-chevron-left'></a>" : "") + "</td>" + "<td class='datepicker-title' colspan='5'>" + titleMonthYear + "</td>" + "<td class='datepicker-next'>" + (showN ? "<a href='javascript:;' class='fa fa-chevron-right'></a>" : "") + "</td>" + "</tr>" + "<tr class='datepicker-dow'>" + "<td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>" + "</tr>" + days + "</table>";
    return calendar;
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

