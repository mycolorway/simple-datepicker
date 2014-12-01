
describe 'Simple Datepicker', ->
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

      dp.cal.find('.datepicker-prev a').click()
      dp.cal.find('.datepicker-day a:contains(15)').click()

    it 'should works all right', (done) ->
      expect(date).toEqual(desiredDate)
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

      dp.cal.find('.datepicker-title a').click()

      dp._yearmonth.find('.datepicker-year a.selected').parent().next().find('a').click()
      dp._yearmonth.find('.datepicker-month a.contains(3)').click()
      dp._yearmonth.find('.datepicker-yearmonth-ok').click()
      dp.cal.find('.datepicker-day a:contains(15)').click()

    it 'should works all right', (done)->
      expect(date).toEqual desiredDate
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

      dp.cal.find('.datepicker-title a').click()
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 1

      dp.setSelectedDate dateStr
      expect(dp.cal.find('.datepicker-yearmonth').length).toEqual 1

  afterEach ->
    $('.simple-datepicker').remove()
