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
      var date, desiredDate, inlineDatepicker;
      date = null;
      desiredDate = null;
      inlineDatepicker = null;
      beforeEach(function(done) {
        var today;
        $('.simple-datepicker').remove();
        inlineDatepicker = simple.datepicker({
          el: $("body"),
          inline: true
        });
        inlineDatepicker.on('select', function(e, _date) {
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
        expect($('body').data('theDate').format('YYYY-MM-DD')).toEqual(desiredDate);
        expect(inlineDatepicker.selectedDate.format('YYYY-MM-DD')).toEqual(desiredDate);
        return done();
      });
    });
    describe('Quick Year&Month selecting', function() {
      var date, inlineDatepicker;
      date = null;
      inlineDatepicker = null;
      beforeEach(function(done) {
        var today, try_timeout;
        $('.simple-datepicker').remove();
        inlineDatepicker = simple.datepicker({
          el: $("body"),
          inline: true
        });
        inlineDatepicker.on('select', function(e, _date) {
          date = _date;
          return done();
        });
        today = moment();
        $('.simple-datepicker .datepicker-title a').trigger('click');
        try_timeout = 0;
        while ($('.simple-datepicker .datepicker-yearmonth .datepicker-year a:first').text() * 1 > 1998 && try_timeout < 1000) {
          $('.simple-datepicker .datepicker-yearmonth .datepicker-year-prev a').trigger('click');
          try_timeout++;
        }
        while ($('.simple-datepicker .datepicker-yearmonth .datepicker-year a:last').text() * 1 < 1998 && try_timeout < 1000) {
          $('.simple-datepicker .datepicker-yearmonth .datepicker-year-next a').trigger('click');
          try_timeout++;
        }
        $('.simple-datepicker .datepicker-yearmonth .datepicker-year a:contains(1998)').trigger('click');
        $($('.simple-datepicker .datepicker-yearmonth .datepicker-month a').get(2)).trigger('click');
        $('.simple-datepicker .datepicker-yearmonth .datepicker-yearmonth-ok').trigger('click');
        return $('.simple-datepicker .datepicker-day a:contains(15)').trigger('click');
      });
      return it('should set date to March 15th, 1998', function(done) {
        expect(date).toEqual('1998-03-15');
        expect($('body').data('theDate').format('YYYY-MM-DD')).toEqual('1998-03-15');
        expect(inlineDatepicker.selectedDate.format('YYYY-MM-DD')).toEqual('1998-03-15');
        return done();
      });
    });
    describe('Set date using setSelectedDate', function() {
      var inlineDatepicker;
      inlineDatepicker = null;
      beforeEach(function() {
        $('.simple-datepicker').remove();
        inlineDatepicker = simple.datepicker({
          el: $("body"),
          inline: true
        });
        return inlineDatepicker.setSelectedDate('1998-03-15');
      });
      return it('should set date to March 15th, 1998', function() {
        expect($('body').data('theDate').format('YYYY-MM-DD')).toEqual('1998-03-15');
        return expect(inlineDatepicker.selectedDate.format('YYYY-MM-DD')).toEqual('1998-03-15');
      });
    });
    return afterEach(function() {
      return $('.simple-datepicker').remove();
    });
  });

}).call(this);
