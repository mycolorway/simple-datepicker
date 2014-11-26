(function() {
  describe('Simple Datepicker', function() {
    it('should inherit from SimpleModule', function() {
      var datepicker;
      datepicker = simple.datepicker({
        el: $("body")
      });
      return expect(datepicker instanceof SimpleModule).toBe(true);
    });
    describe('Date selecting', function() {
      var date, desiredDate;
      date = null;
      desiredDate = null;
      beforeEach(function(done) {
        var inline_datepicker, today;
        $('.simple-datepicker').remove();
        inline_datepicker = simple.datepicker({
          el: $("body"),
          inline: true
        });
        inline_datepicker.on('select', function(e, _date) {
          date = _date;
          return done();
        });
        today = moment();
        desiredDate = today.clone().add('month', -1).set('date', 15).format('YYYY-MM-DD');
        $('.simple-datepicker .datepicker-prev a').trigger('click');
        return $('.simple-datepicker .datepicker-day a').each(function() {
          if ($(this).text() * 1 === 15) {
            $(this).trigger('click');
            return false;
          }
        });
      });
      return it('should set date to 15th of last month', function(done) {
        expect(date).toEqual(desiredDate);
        return done();
      });
    });
    describe('Quick Year&Month selecting', function() {
      var date;
      date = null;
      beforeEach(function(done) {
        var inline_datepicker, today;
        $('.simple-datepicker').remove();
        inline_datepicker = simple.datepicker({
          el: $("body"),
          inline: true
        });
        inline_datepicker.on('select', function(e, _date) {
          date = _date;
          return done();
        });
        today = moment();
        $('.simple-datepicker .datepicker-title a').trigger('click');
        while ($($('.simple-datepicker .datepicker-yearmonth .datepicker-year a').get(0)).text() * 1 > 1998) {
          $('.simple-datepicker .datepicker-yearmonth .datepicker-year-prev a').trigger('click');
        }
        while ($($('.simple-datepicker .datepicker-yearmonth .datepicker-year a').get(-1)).text() * 1 < 1998) {
          $('.simple-datepicker .datepicker-yearmonth .datepicker-year-next a').trigger('click');
        }
        $('.simple-datepicker .datepicker-yearmonth .datepicker-year a').each(function() {
          if ($(this).text() * 1 === 1998) {
            $(this).trigger('click');
            return false;
          }
        });
        $($('.simple-datepicker .datepicker-yearmonth .datepicker-month a').get(2)).trigger('click');
        $('.simple-datepicker .datepicker-yearmonth .datepicker-yearmonth-ok').trigger('click');
        return $('.simple-datepicker .datepicker-day a').each(function() {
          if ($(this).text() * 1 === 15) {
            $(this).trigger('click');
            return false;
          }
        });
      });
      return it('should set date to March 15th, 1998', function(done) {
        expect(date).toEqual('1998-03-15');
        return done();
      });
    });
    return afterEach(function() {
      return $('.simple-datepicker').remove();
    });
  });

}).call(this);
