(function() {
  describe('Simple Datepicker', function() {
    it('should inherit from SimpleModule', function() {
      var datepicker;
      datepicker = simple.datepicker({
        el: $('body')
      });
      return expect(datepicker instanceof SimpleModule).toBe(true);
    });
    describe('select day', function() {
      var date, desiredDate, dp;
      date = null;
      desiredDate = null;
      dp = null;
      beforeEach(function(done) {
        var today;
        dp = simple.datepicker({
          el: $('body'),
          inline: true
        });
        dp.on('select', function(e, _date) {
          date = _date;
          return done();
        });
        today = moment();
        desiredDate = today.clone().add('month', -1).set('date', 15).format('YYYY-MM-DD');
        dp.cal.find('.datepicker-prev a').click();
        return dp.cal.find('.datepicker-day a:contains(15)').click();
      });
      return it('should works all right', function(done) {
        expect(date.format('YYYY-MM-DD')).toEqual(desiredDate);
        expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(desiredDate);
        return done();
      });
    });
    describe('select year/Month', function() {
      var date, desiredDate, dp;
      date = null;
      desiredDate = null;
      dp = null;
      beforeEach(function(done) {
        var today;
        dp = simple.datepicker({
          el: $('body'),
          inline: true
        });
        dp.on('select', function(e, _date) {
          date = _date;
          return done();
        });
        today = moment();
        desiredDate = today.clone().add(1, 'year').set('month', 2).set('date', 15).format('YYYY-MM-DD');
        dp.cal.find('.datepicker-title a').click();
        dp._yearmonth.find('.datepicker-year a.selected').parent().next().find('a').click();
        dp._yearmonth.find('.datepicker-month a:contains(Mar)').click();
        dp._yearmonth.find('.datepicker-yearmonth-ok').click();
        return dp.cal.find('.datepicker-day a:contains(15)').click();
      });
      return it('should works all right', function(done) {
        expect(date.format('YYYY-MM-DD')).toEqual(desiredDate);
        expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(desiredDate);
        return done();
      });
    });
    describe('instance method [setSelectedDate]', function() {
      var dateStr, dp, target;
      dateStr = '1998-03-15';
      target = $('body');
      dp = null;
      beforeEach(function() {
        return dp = simple.datepicker({
          el: target,
          inline: true
        });
      });
      it('should works when pass in a string', function() {
        dp.setSelectedDate(dateStr);
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(dateStr);
      });
      it('should works when pass in a moment', function() {
        dp.setSelectedDate(moment(dateStr));
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(dateStr);
      });
      it('should update calendar due to the new date', function() {
        var day, title;
        dp.setSelectedDate(dateStr);
        title = $.trim(dp.cal.find('.datepicker-title').text());
        day = dp.cal.find('.datepicker-day a.selected').text() * 1;
        expect(title).toEqual(dp._formatTitle(moment(dateStr, 'YYYY-MM-DD')));
        return expect(day).toEqual(day);
      });
      return it('should stay at same view', function() {
        expect(dp.cal.find('.datepicker-yearmonth').length).toEqual(0);
        dp.setSelectedDate(dateStr);
        expect(dp.cal.find('.datepicker-yearmonth').length).toEqual(0);
        dp.cal.find('.datepicker-title a').click();
        expect(dp.cal.find('.datepicker-yearmonth').length).toEqual(1);
        dp.setSelectedDate(dateStr);
        return expect(dp.cal.find('.datepicker-yearmonth').length).toEqual(1);
      });
    });
    describe('Specify options', function() {
      var dp, makeDp, target;
      target = $('body');
      dp = null;
      makeDp = function(opts) {
        var _opts;
        _opts = {
          el: target
        };
        return dp = simple.datepicker($.extend(_opts, opts));
      };
      it('should disappear on blow when inline is false', function() {
        makeDp({
          inline: false
        });
        $(document).click();
        return expect($(document).find('.simple-datepicker').length).toBe(0);
      });
      it('should not show month navigators in calendar when showPrevNext is false', function() {
        makeDp({
          showPrevNext: false
        });
        expect(dp.cal.find('.datepicker-prev a').length).toBe(0);
        return expect(dp.cal.find('.datepicker-next a').length).toBe(0);
      });
      it('should show year navigators in year&month panel when showYearPrevNext is true', function() {
        var year;
        makeDp({
          showYearPrevNext: true
        });
        year = dp.selectedDate.year();
        console.log(year);
        dp.cal.find('.datepicker-title a').click();
        dp.cal.find('.datepicker-year-prev a').click();
        expect(dp.cal.find(".datepicker-year a:contains(" + (year - 10) + ")").length).toEqual(1);
        dp.cal.find('.datepicker-year-next a').click();
        return expect(dp.cal.find(".datepicker-year a:contains(" + year + ")").length).toEqual(1);
      });
      it('should set year and month to the viewDate', function() {
        var date;
        date = moment().add('year', 1).add('month', 1);
        makeDp({
          viewDate: moment().add('year', 1).add('month', 1)
        });
        expect(dp.cal.find('.datepicker-title').text().trim()).toEqual(date.format('YYYY年M月'));
        dp.cal.find('.datepicker-day a:contains(15)').click();
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(date.clone().date(15).format('YYYY-MM-DD'));
      });
      it('should disable the dates after the date specified by disableAfter option', function() {
        var date;
        date = moment().startOf('month');
        makeDp({
          disableAfter: date
        });
        dp.setSelectedDate(date);
        dp.cal.find(".datepicker-day a:not(.others):contains(2):first").click();
        expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(date.format('YYYY-MM-DD'));
        dp.cal.find('.datepicker-next').click();
        dp.cal.find('.datepicker-day a:contains(15)').click();
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(date.format('YYYY-MM-DD'));
      });
      it('should disable the dates before the date specified by disableBefore option', function() {
        var date, theDate;
        date = moment().endOf('month');
        theDate = date.date();
        makeDp({
          disableBefore: date
        });
        dp.setSelectedDate(date);
        dp.cal.find(".datepicker-day a:not(.others):contains(" + (theDate - 1) + "):last").click();
        expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(date.format('YYYY-MM-DD'));
        dp.cal.find('.datepicker-prev').click();
        dp.cal.find('.datepicker-day a:contains(15)').click();
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(date.format('YYYY-MM-DD'));
      });
      it('should set value in the format specified by format option', function() {
        var date;
        date = moment();
        makeDp({
          format: 'YY-M-D'
        });
        dp.setSelectedDate(date);
        return expect(target.val()).toEqual(date.format('YY-M-D'));
      });
      return afterEach(function() {
        if (dp && dp.cal) {
          return dp.cal.remove();
        }
      });
    });
    return afterEach(function() {
      return $('.simple-datepicker').remove();
    });
  });

}).call(this);
