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
        expect(date).toEqual(desiredDate);
        expect(dp.el.data('theDate').format('YYYY-MM-DD')).toEqual(desiredDate);
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
        dp._yearmonth.find('.datepicker-month a:contains(3)').click();
        dp._yearmonth.find('.datepicker-yearmonth-ok').click();
        return dp.cal.find('.datepicker-day a:contains(15)').click();
      });
      return it('should works all right', function(done) {
        expect(date).toEqual(desiredDate);
        expect(dp.el.data('theDate').format('YYYY-MM-DD')).toEqual(desiredDate);
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
        expect(target.data('theDate').format('YYYY-MM-DD')).toEqual(dateStr);
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(dateStr);
      });
      it('should works when pass in a moment', function() {
        dp.setSelectedDate(moment(dateStr));
        expect(target.data('theDate').format('YYYY-MM-DD')).toEqual(dateStr);
        return expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(dateStr);
      });
      it('should update calendar due to the new date', function() {
        var day, title;
        dp.setSelectedDate(dateStr);
        title = $.trim(dp.cal.find('.datepicker-title').text());
        day = dp.cal.find('.datepicker-day a.selected').text() * 1;
        expect(title).toEqual(dp._formatTitle(1998, 2));
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
    return afterEach(function() {
      return $('.simple-datepicker').remove();
    });
  });

}).call(this);
