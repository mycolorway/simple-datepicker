
describe 'Simple Datepicker', ->
  afterEach ->
    $('.simple-datepicker').remove()
    $('body').val(null)

  it 'should inherit from SimpleModule', ->
    datepicker = simple.datepicker
      el: $('body')
    expect(datepicker instanceof SimpleModule).toBe(true)

  describe 'select day', ->
    date = null
    desiredDate = null
    dp = null

    beforeEach (done)->
      dp = simple.datepicker
        el: $('body')
        inline: true

      dp.on 'select', (e, _date) ->
        date = _date
        done()

      today = moment()
      desiredDate = today.clone().add('month', -1)
                      .set('date', 15).format('YYYY-MM-DD')

      dp.cal.find('.datepicker-prev').click()
      dp.cal.find('.datepicker-day a:contains(15)').click()

    it 'should works all right', (done) ->
      expect(date.format('YYYY-MM-DD')).toEqual(desiredDate)
      expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual(desiredDate)
      done()

  describe 'select year/Month', ->
    date = null
    desiredDate = null
    dp = null

    beforeEach (done)->
      dp = simple.datepicker
        el: $('body')
        inline: true

      dp.on 'select', (e, _date) ->
        date = _date
        done()

      today = moment()
      desiredDate = today.clone().add(1, 'year')
                      .set('month', 2).set('date', 15)
                      .format('YYYY-MM-DD')

      dp.cal.find('.datepicker-title').click()

      dp._yearmonth.find('.datepicker-year a.selected').parent().next().find('a').click()
      dp._yearmonth.find('.datepicker-month a:contains(Mar)').click()
      #dp._yearmonth.find('.datepicker-yearmonth-ok').click()
      dp.cal.find('.datepicker-day a:contains(15)').click()

    it 'should works all right', (done)->
      expect(date.format('YYYY-MM-DD')).toEqual desiredDate
      expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual desiredDate
      done()

  describe 'cancel year&month select', ->
    date = null
    desiredDate = null
    dp = null

    beforeEach (done)->
      dp = simple.datepicker
        el: $('body')
        inline: true

      dp.on 'select', (e, _date) ->
        date = _date
        done()

      today = moment()
      desiredDate = today.clone().set('date', 15).format('YYYY-MM-DD')

      dp.cal.find('.datepicker-title').click()

      dp._yearmonth.find('.datepicker-year a.selected').parent().next().find('a').click()
      #dp._yearmonth.find('.datepicker-month a:contains(Mar)').click()
      dp._yearmonth.find('.datepicker-yearmonth-cancel').click()
      dp.cal.find('.datepicker-day a:contains(15)').click()

    it 'should not set year and month when go back from year&month to calendar by clicking "cancel"', (done)->
      expect(date.format('YYYY-MM-DD')).toEqual desiredDate
      expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual desiredDate
      done()

  describe 'instance method [setSelectedDate]', ->
    dateStr = '1998-03-15'
    target = $('body')
    dp = null

    beforeEach ->
      dp = simple.datepicker
        el: target
        inline: true

    it 'should works when pass in a string', ->
      dp.setSelectedDate dateStr

      expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual dateStr

    it 'should works when pass in a moment', ->
      dp.setSelectedDate moment(dateStr)

      expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual dateStr

    it 'should update calendar due to the new date', ->
      dp.setSelectedDate dateStr

      title = $.trim dp.cal.find('.datepicker-title').text()
      day = dp.cal.find('.datepicker-day a.selected').text()*1

      expect(title).toEqual dp._formatTitle(moment(dateStr, 'YYYY-MM-DD'))
      expect(day).toEqual day

    it 'should stay at same view', ->
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 0

      dp.setSelectedDate dateStr
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 0

      dp.cal.find('.datepicker-title').click()
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 1

      dp.setSelectedDate dateStr
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 1

  describe 'Specify options', ->
    target = $('body')
    dp = null

    makeDp = (opts)->
      _opts =
        el: target
        inline: true
      dp = simple.datepicker $.extend({}, _opts, opts)

    it 'should disappear on blow when inline is false', ->
      makeDp
        inline: false
      $(document).click()
      expect($(document).find('.simple-datepicker').length).toBe 0

    it 'should not show month navigators in calendar when showPrevNext is false', ->
      makeDp
        showPrevNext: false
      expect(dp.cal.find('.datepicker-prev').length).toBe 0
      expect(dp.cal.find('.datepicker-next').length).toBe 0

    it 'should show year navigators in year&month panel when showYearPrevNext is true', ->
      makeDp
        showYearPrevNext: true
      year = (dp.selectedDate or dp._viewDate).year()
      dp.cal.find('.datepicker-title').click()
      expect(dp.cal.find(".datepicker-year-prev").length).toEqual 1
      expect(dp.cal.find(".datepicker-year-next").length).toEqual 1

    it 'should set year and month to the viewDate', ->
      date = moment().add('year', 1).add('month', 1)
      makeDp
        viewDate: moment().add('year', 1).add('month', 1)
      expect(dp.cal.find('.datepicker-title').text().trim()).toEqual date.format 'YYYY年M月'

    it 'should view year/month select when set viewType [yearmonth]', ->
      makeDp
        viewType: 'yearmonth'
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 1

    it 'should disable the dates after the date specified by disableAfter option', ->
      date = moment().startOf('month')
      makeDp
        disableAfter: date
      dp.setSelectedDate date
      expect(dp.cal.find(".datepicker-day a:not(.others).disabled:contains(2):first").length).toEqual 1
      dp.cal.find('.datepicker-next').click()
      expect(dp.cal.find(".datepicker-day a:not(.others):not(.disabled)").length).toEqual 0

    it 'should disable the dates before the date specified by disableBefore option', ->
      date = moment().endOf('month')
      theDate = date.date()
      makeDp
        disableBefore: date
      dp.setSelectedDate date
      expect(dp.cal.find(".datepicker-day a:not(.others).disabled:contains(#{theDate-1}):last").length).toEqual 1
      dp.cal.find('.datepicker-prev').click()
      expect(dp.cal.find(".datepicker-day a:not(.others):not(.disabled)").length).toEqual 0

    afterEach ->
      dp.cal.remove() if dp and dp.cal

  describe 'Year navigators', ->
    it 'should works all right', ->
      dp = simple.datepicker
        el: $('body')
        inline: true
        showYearPrevNext: true

      year = (dp.selectedDate or dp._viewDate).year()
      dp.cal.find('.datepicker-title').click()
      dp.cal.find('.datepicker-year-prev').click()
      expect(dp.cal.find(".datepicker-year a:contains(#{year-10})").length).toEqual 1
      dp.cal.find('.datepicker-year-next').click()
      expect(dp.cal.find(".datepicker-year a:contains(#{year})").length).toEqual 1

  describe 'Disable dates', ->
    date = null
    desiredDate = null
    dp = null

    describe 'disableAfter option', ->
      beforeEach (done)->
        theDate = moment().startOf('month')
        desiredDate = theDate.format 'YYYY-MM-DD'
        dp = simple.datepicker
          el: $('body')
          inline: true
          disableAfter: theDate
        dp.on 'select', (e, _date) ->
          date = _date
          done()
        dp.setSelectedDate theDate
        dp.cal.find(".datepicker-day a:not(.others):contains(2):first").click()   # Click the 2nd day button of this month

      it 'should works all right', (done)->
        expect(date.format('YYYY-MM-DD')).toEqual desiredDate
        expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual desiredDate
        done()

    describe 'disableBefore option', ->
      beforeEach (done)->
        theDate = moment().endOf('month')
        desiredDate = theDate.format 'YYYY-MM-DD'
        dp = simple.datepicker
          el: $('body')
          inline: true
          disableBefore: theDate
        dp.on 'select', (e, _date) ->
          date = _date
          done()
        dp.setSelectedDate theDate
        dp.cal.find(".datepicker-day a:not(.others):contains(#{theDate.date()-1}):last").click()   # Click the day before the last day button of this month

      it 'should works all right', (done)->
        expect(date.format('YYYY-MM-DD')).toEqual desiredDate
        expect(dp.selectedDate.format('YYYY-MM-DD')).toEqual desiredDate
        done()

  describe 'Specify format', ->
    date = null
    desiredDate = null
    dp = null

    beforeEach (done)->
      dp = simple.datepicker
        el: $('body')
        inline: true
        format: 'YY-M-D'

      dp.on 'select', (e, _date) ->
        date = _date
        done()

      today = moment()
      desiredDate = today.clone().add('month', -1)
                      .set('date', 15).format('YY-M-D')

      dp.cal.find('.datepicker-prev').click()
      dp.cal.find('.datepicker-day a:contains(15)').click()

    it 'should works all right', (done) ->
      expect($('body').val()).toEqual(desiredDate)
      done()
