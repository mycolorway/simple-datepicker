describe 'Simple Datepicker', ->

  beforeEach ->
    $('<input id="time">').appendTo 'body'

  afterEach ->
    datepicker = $('#time').data 'datepicker'
    datepicker?.destroy()
    $('#time').remove()

  it 'should throw error when option is invalid', ->
    testError = ->
      simple.datepicker
        el: null

    expect(testError).toThrow()

  it 'should render specific DOM', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    $datepicker = $('.simple-datepicker')


    expect($datepicker).toExist()
    expect($datepicker.find('.datepicker-header')).toExist()
    expect($datepicker.find('.datepicker-yearmonth .datepicker-year-container')).toExist()
    expect($datepicker.find('table.calendar')).toExist()

    datepicker.destroy()

    datepicker = simple.datepicker
      el: '#time'
      inline: true
      monthpicker: true

    $datepicker = $('.simple-datepicker')
    expect($datepicker.find('table.calendar')).not.toExist()


  it 'should show when focused and inline off', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: false

    $('#time').blur()
    expect($('.simple-datepicker')).not.toExist()
    $('#time').focus()
    $('#time').focus() #patch
    expect($('.simple-datepicker')).toExist()

  it 'should render right calendar based on year and month', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    $datepicker = $('.simple-datepicker')
    $datepicker.find('[data-year=2016]').click()
    $datepicker.find('[data-month=5]').click()

    expect($datepicker.find('[data-date=2016-06-01]')).toExist()

  it 'should slide monthpicker when hit header', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    $datepicker = $('.simple-datepicker')
    $monthpicker = $datepicker.find('.datepicker-yearmonth')
    expect($monthpicker).not.toBeVisible()

    $datepicker.find('.datepicker-title').click()
    expect($monthpicker).toBeVisible()


  it 'should pick correct time', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    $datepicker = $('.simple-datepicker')
    $datepicker.find('[data-year=2016]').click()
    $datepicker.find('[data-month=5]').click()
    $datepicker.find('[data-date=2016-06-01]').click()

    expect($('#time').val()).toBe('2016-06-01')

    datepicker.destroy()

    #test pick month
    datepicker = simple.datepicker
      el: '#time'
      inline: true
      monthpicker: true

    $datepicker = $('.simple-datepicker')
    $datepicker.find('[data-year=2016]').click()
    $datepicker.find('[data-month=5]').click()
    expect($('#time').val()).toBe('2016-06')


  it 'should change month when click prev/next button', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    $datepicker = $('.simple-datepicker')
    $datepicker.find('[data-month=5]').click()
    expect($datepicker.find('[data-month=5]')).toHaveClass('selected')
    $datepicker.find('.datepicker-prev').click()
    expect($datepicker.find('[data-month=4]')).toHaveClass('selected')
    $datepicker.find('.datepicker-next').click()
    expect($datepicker.find('[data-month=5]')).toHaveClass('selected')

  it 'should scroll to have more years', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true
      monthpicker: true

    $datepicker = $('.simple-datepicker')
    $years = $datepicker.find('.datepicker-year-container')

    expect($years.find('[data-year=2008]')).not.toExist()
    $years.scrollTop(0)
    $years.trigger 'scroll'
    expect($years.find('[data-year=2008]')).toExist()

    expect($years.find('[data-year=2025]')).not.toExist()
    $years.scrollTop(10000)
    $years.trigger 'scroll'
    expect($years.find('[data-year=2025]')).toExist()

  it 'should set correct date', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    $datepicker = $('.simple-datepicker')
    datepicker.setDate('2016-06-01')
    expect($datepicker.find('[data-year=2016]')).toHaveClass('selected')
    expect($datepicker.find('[data-month=5]')).toHaveClass('selected')
    expect($datepicker.find('[data-date=2016-06-01]')).toHaveClass('selected')
    expect($('#time').val()).toBe('2016-06-01')

  it 'should set correct date when monthpicker on', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true
      monthpicker: true

    $datepicker = $('.simple-datepicker')
    datepicker.setDate('2016-06')
    expect($datepicker.find('[data-year=2016]')).toHaveClass('selected')
    expect($datepicker.find('[data-month=5]')).toHaveClass('selected')
    expect($('#time').val()).toBe('2016-06')

  it 'should clear value when clear is called', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true

    datepicker.setDate('2016-06-01')
    datepicker.clear()
    expect(datepicker.getDate()).toBe(null)

  it 'should reset all when destroy', ->
    datepicker = simple.datepicker
      el: '#time'
      inline: true
      monthpicker: true

    datepicker.destroy()
    expect($('.simple-datepicker')).not.toExist()

  it "should fetch date from @el by @getDate if @date is undefined", ->
    date = "2015-01-01"
    $("<input id='timeWithValue' value='#{date}'>").appendTo 'body'
    datepicker = simple.datepicker
      el: '#timeWithValue'
    expect datepicker.getDate().isSame date
      .toBe true
    $("#timeWithValue").remove()
