(function() {
  describe('Simple Datepicker', function() {
    return it('should inherit from SimpleModule', function() {
      var datepicker;
      datepicker = simple.datepicker({
        el: $("body")
      });
      return expect(datepicker instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
