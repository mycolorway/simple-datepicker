(function() {
  describe('Simple Datepicker', function() {
    beforeEach(function() {
      return $('<input id="time">').appendTo('body');
    });
    afterEach(function() {
      var datepicker;
      datepicker = $('#time').data('datepicker');
      if (datepicker != null) {
        datepicker.destroy();
      }
      return $('#time').remove();
    });
    it('should throw error when option is invalid', function() {
      var testError;
      testError = function() {
        return simple.datepicker({
          el: null
        });
      };
      return expect(testError).toThrow();
    });
    it('should render specific DOM', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      expect($datepicker).toExist();
      expect($datepicker.find('.datepicker-header')).toExist();
      expect($datepicker.find('.datepicker-panels')).toExist();
      expect($datepicker.find('.panel.panel-date table.calendar')).toExist();
      expect($datepicker.find('.panel.panel-month')).toExist();
      expect($datepicker.find('.panel.panel-year')).toExist();
      datepicker.destroy();
      datepicker = simple.datepicker({
        el: '#time',
        inline: true,
        list: ['month', 'year']
      });
      $datepicker = $('.simple-datepicker');
      return expect($datepicker.find('table.calendar')).not.toExist();
    });
    it('should show when focused and inline off', function() {
      var datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: false
      });
      $('.display-input').blur();
      expect($('.simple-datepicker')).not.toBeVisible();
      $('.display-input').focus();
      $('.display-input').focus();
      return expect($('.simple-datepicker')).toBeVisible();
    });
    it('should render right calendar based on year and month', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      $datepicker.find('.panel-year a[data-value=2016]').click();
      $datepicker.find('.panel-month a[data-value=5]').click();
      return expect($datepicker.find('.panel-date a[data-value=2016-06-01]')).toExist();
    });
    it('should change different panel when focus on different field', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      expect($datepicker.find('.panel-year')).toBeVisible();
      expect($datepicker.find('.panel-month')).not.toBeVisible();
      expect($datepicker.find('.panel-date')).not.toBeVisible();
      $datepicker.find('.month-input').focus();
      expect($datepicker.find('.panel-year')).not.toBeVisible();
      expect($datepicker.find('.panel-month')).toBeVisible();
      expect($datepicker.find('.panel-date')).not.toBeVisible();
      $datepicker.find('.date-input').focus();
      expect($datepicker.find('.panel-year')).not.toBeVisible();
      expect($datepicker.find('.panel-month')).not.toBeVisible();
      return expect($datepicker.find('.panel-date')).toBeVisible();
    });
    it('should pick correct time', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      $datepicker.find('.panel-year a[data-value=2016]').click();
      $datepicker.find('.panel-month a[data-value=6]').click();
      $datepicker.find('.panel-date a[data-value=2016-06-01]').click();
      expect($('#time').val()).toBe('2016-06-01');
      datepicker.destroy();
      datepicker = simple.datepicker({
        el: '#time',
        inline: true,
        list: ['year', 'month'],
        valueFormat: 'YYYY-MM'
      });
      $datepicker = $('.simple-datepicker');
      $datepicker.find('.panel-year a[data-value=2016]').click();
      $datepicker.find('.panel-month a[data-value=6]').click();
      return expect($('#time').val()).toBe('2016-06');
    });
    it('should change month when click prev/next button', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      $datepicker.find('.panel-year a[data-value=2016]').click();
      $datepicker.find('.panel-month a[data-value=6]').click();
      expect($datepicker.find('.panel-month a[data-value=6]')).toHaveClass('selected');
      $datepicker.find('.panel-date a[data-action=prev]').click();
      expect($datepicker.find('.panel-month a[data-value=5]')).toHaveClass('selected');
      $datepicker.find('.panel-date a[data-action=next]').click();
      return expect($datepicker.find('.panel-month a[data-value=6]')).toHaveClass('selected');
    });
    it('should change year panel when click prev/next button', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      expect($datepicker.find('.panel-year a[data-value=2010]')).toExist();
      $datepicker.find('.panel-year a[data-action=prev]').click();
      expect($datepicker.find('.panel-year a[data-value=2000]')).toExist();
      $datepicker.find('.panel-year a[data-action=next]').click();
      return expect($datepicker.find('.panel-year a[data-value=2010]')).toExist();
    });
    it('should set correct date', function() {
      var $datepicker, datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      $datepicker = $('.simple-datepicker');
      datepicker.setDate('2016-06-01');
      expect($datepicker.find('.panel-year a[data-value=2016]')).toHaveClass('selected');
      expect($datepicker.find('.panel-month a[data-value=6]')).toHaveClass('selected');
      expect($datepicker.find('.panel-date a[data-value=2016-06-01]')).toHaveClass('selected');
      return expect($('#time').val()).toBe('2016-06-01');
    });
    it('should clear value when clear is called', function() {
      var datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true
      });
      datepicker.setDate('2016-06-01');
      datepicker.clear();
      return expect(datepicker.getDate()).toBe(null);
    });
    it('should reset all when destroy', function() {
      var datepicker;
      datepicker = simple.datepicker({
        el: '#time',
        inline: true,
        monthpicker: true
      });
      datepicker.destroy();
      return expect($('.simple-datepicker')).not.toExist();
    });
    return it("should fetch date from @el by @getDate if @date is undefined", function() {
      var date, datepicker;
      date = "2015-01-01";
      $("<input id='timeWithValue' value='" + date + "'>").appendTo('body');
      datepicker = simple.datepicker({
        el: '#timeWithValue'
      });
      expect(datepicker.getDate().isSame(date)).toBe(true);
      return $("#timeWithValue").remove();
    });
  });

}).call(this);
