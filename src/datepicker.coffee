class Datepicker extends SimpleModule
  opts:
    el: null
    inline: false
    disableBefore: null
    disableAfter: null
    format: 'YYYY-MM-DD'
    width: null
    monthpicker: false

  @i18n:
    'zh-CN':
      year: '年'
      month: '月'
      currentYear: '今年'
      nextYear: '明年'
      lastYear: '去年'
      beforeLastYear: '去年'
    'en':
      year: 'Y'
      month: 'M'
      currentYear: 'current year'
      nextYear: 'new year'
      lastYear: 'last year'
      beforeLastYear: 'the year before last'

  _init: ->
    @el = $(@opts.el)

    unless @el.length
      throw 'simple datepicker: option el is required'
      return

    @opts.format = 'YYYY-MM' if @opts.monthpicker
    @el.data 'datepicker', @

    @_render()

  _render: ->
    if @opts.inline
      @_show()
    else
      @el.on 'focus click', (e) =>
        return if @cal
        @_show()

      $(document).on "click.datepicker", (e) =>
        @_hide() unless @el.is(e.target) or @el.has(e.target).length

  _show: ->
    val = @el.val() || moment().startOf(if @opts.monthpicker then 'month' else 'day')
    @date = if moment.isMoment(val) then val else moment(val, @opts.format)

    @_renderPanel()
    @_bindEvent()

  _hide: ->
    if @cal
      @cal.remove()
      @cal = null

  _renderPanel: ->
    _calTemplate = """
      <div class="simple-datepicker">
        <div class="datepicker-header">
          <a href="javascript:;" class="datepicker-prev"><i class="icon-chevron-left"><span>&lt;</span></i></a>
          <a href="javascript:;" class="datepicker-title">#{  @_formatTitle(@date) }</a>
          <a href="javascript:;" class="datepicker-next"><i class="icon-chevron-right"><span>&gt;</span></i></a>
        </div>
      </div>
    """
    @cal = $(_calTemplate)
    if @opts.inline
      @cal.insertAfter @el
    else
      $('body').append @cal
      @_setPosition()

    @cal.addClass('simple-monthpicker') if @opts.monthpicker
    @cal.data('datepicker', @)
    @cal.css("width", @opts.width) if @opts.width

    @cal.append(@_renderYearMonth())
    @cal.append(@_renderCal()) unless @opts.monthpicker

    @_calendar = @cal.find('.calendar')
    @_monthpicker = @cal.find('.datepicker-yearmonth')
    @_year = @_monthpicker.find('.year-input').val(@date.year())
    @_month = @_monthpicker.find('.month-input').val(Number(@date.month())+1)
    @_title = @cal.find('.datepicker-title')

    if @opts.monthpicker
      @_monthpicker.show()
      @cal.find('.datepicker-header').remove() #header not show when monthpicker only
    else
      @_calendar.find("[data-date=#{@date.format('YYYY-MM-DD')}]").addClass('selected')


  _bindEvent: ->
    @cal.on 'mousedown click', (e) ->
      false

    .on 'click', '.datepicker-title', (e) =>
      @cal.toggleClass('expanded') unless @opts.monthpicker
      if @cal.is '.expanded'
        @_year.focus()

    .on 'click', '.datepicker-prev, .datepicker-next', (e) =>
      e.preventDefault()

      direction = if $(e.currentTarget).is('.datepicker-prev') then -1 else 1
      @date.add(direction, 'months')
      @_refresh()

    .on 'click', '.datepicker-day a', (e) =>
      e.preventDefault()

      btn = $(e.currentTarget)
      return if btn.hasClass('disabled')

      @cal.find('.datepicker-day a.selected').removeClass('selected')
      btn.addClass('selected')

      @date = moment(btn.data('date'), 'YYYY-MM-DD')
      @_updateDate()
      @_hide() unless @opts.inline

    .on 'click mousedown', '.year-input, .month-input', (e) ->
      $(@).focus()

    @_monthpicker.on 'keydown', '.year-input, .month-input', (e) =>
      key = e.which
      $input = $(e.currentTarget)
      yearInput = true if $input.is '.year-input'

      return if [8, 27].indexOf(key) isnt -1 #del backspace

      if key is 9 #tab
        if yearInput
          year = Number($input.val())
          if year < 50
            year += 2000
          else if year < 100
            year += 1900
          $input.val year
          @date.year year
          @_refresh()
          return
        else
          month = $input.val() - 1
          @date.months month
          @_refresh()

          if @opts.monthpicker
            @_updateDate()
            @_hide() unless @opts.inline
          else
            @cal.removeClass 'expanded'
          return

      if key is 13 #enter
        @date.year @_year.val()
        @date.months @_month.val()-1

        @_refresh()

        if @opts.monthpicker
          @_updateDate()
          @_hide() unless @opts.inline
        else
          @cal.removeClass 'expanded'

        return e.preventDefault()

      if [48..57].indexOf(key) isnt -1
        if yearInput
          year = $input.val()
          $input.val(year.substring(year.length - 3))  if Number(year)*10 + key - 48 > 9999
        else
          month = $input.val()
          $input.val(month.substring(month.length)) if Number(month)*10 + key - 48 > 12
        return

      if key is 38 or key is 40 # up and down
        direction = if key is 38 then 1 else -1
        newData = Number($input.val()) + direction
        if yearInput
          newData = 1900 if newData > 9999
          newData = 1900 if newData < 1000
        else
          newData = 1 if newData > 12
          newData = 12 if newData < 1
        $input.val(newData)
        return e.preventDefault()

      e.preventDefault()

    @_monthpicker.on 'click', '.icon-triangle-down', (e) =>
      e.stopPropagation()

      $target = $(e.currentTarget)
      $wrapper = $target.parent()
      $popover = $wrapper.next('.datepicker-popover')

      if $popover.is '.expanded'
        $popover.removeClass 'expanded'
        return

      $(document).off 'click.datepicker-popover'
      @cal.off 'click.datepicker-popover'
      @_monthpicker.find('.datepicker-popover').removeClass 'expanded'

      $popover.css 'width', $wrapper.outerWidth()
      $popover.addClass 'expanded'

      @cal.one 'click.datepicker-popover', (e) =>
        $(document).off 'click.datepicker-popover'
        $popover.removeClass 'expanded'

      $(document).one 'click.datepicker-popover', (e) =>
        @cal.off 'click.datepicker-popover'
        $popover.removeClass 'expanded'


    @_monthpicker.on 'click', '.datepicker-popover p', (e) =>
      e.stopPropagation()

      $target = $(e.currentTarget)
      value = $target.data 'value'

      $popover = $target.parent('.datepicker-popover')
      $input = $popover.prev('.input-wrapper').find('input')

      $input.val(value+1)

      @date.set($input.data('type'), value)
      @_refresh()
      $popover.removeClass 'expanded'



  _refresh: ->
    return unless @cal
    unless @opts.monthpicker
      @_calendar.replaceWith(@_renderCal())
      @_calendar = @cal.find('.calendar')

    @_title.text(@_formatTitle(@date))

    year = @date.year()
    month = @date.months()
    date = @date.format(@opts.format)

    @_year.val(year)
    @_month.val(month+1)

    @_monthpicker.find('.datepicker-popover p').removeClass 'selected'
    @_monthpicker.find("[data-value=#{year}]").addClass('selected')
    @_monthpicker.find("[data-value=#{month}]").addClass('selected')
    @_calendar.find("[data-date=#{date}]").addClass('selected') unless @opts.monthpicker

  _renderCal: ->
    week = ''
    for i in [1, 2, 3, 4, 5, 6 ,0]
      week += "<td>#{moment.weekdaysMin(i)}</td>"
    return """
      <table class="calendar">
        <tr class="datepicker-dow">
          #{week}
        </tr>
        #{ @_renderDaySelectors() }
      </table>
    """

  _renderYearMonth: ->
    return """
      <div class="datepicker-yearmonth">
        <div class="datepicker-year-container">
          <div class="input-wrapper">
            <input class="year-input" data-type="year"/>
            <i class="icon-triangle-down"><span>&#9660;</span></i>
          </div>
          #{@_renderYearSelect()}
          <span>#{@_t 'year'}</span>
        </div>
        <div class="datepicker-month-container">
          <div class="input-wrapper">
            <input class="month-input" data-type="month"/>
            <i class="icon-triangle-down"><span>&#9660;</span></i>
          </div>
          #{@_renderMonthSelect()}
          <span>#{@_t 'month'}</span>
        </div>
      </div>
    """

  _renderYearSelect: ->
    currentYear = moment().year()
    return """
      <div class="datepicker-popover">
        <p data-value="#{currentYear}">#{@_t 'currentYear'}</p>
        <p data-value="#{currentYear+1}">#{@_t 'nextYear'}</p>
        <p data-value='#{currentYear-1}'>#{@_t 'lastYear'}</p>
        <p data-value='#{currentYear-2}'>#{@_t 'beforeLastYear'}</p>
      </div>
    """

  _renderMonthSelect: ->

    el = '<div class="datepicker-popover">'
    for month in [1..12]
      el+= "<p data-value='#{month-1}'>#{month}</p>"
    el += "</div>"

  _renderDaySelectors: ->
    today = moment().startOf("day")

    # Calculate the first and last date in month being rendered.
    # Also calculate the weekday to start rendering on
    firstDate = @date.clone().startOf("month")
    lastDate = @date.clone().endOf("month")

    # Calculate the last day in previous month
    prevLastDate = @date.clone().add(-1, "months").endOf("month")

    # Render the cells as <TD>
    days = ""
    y = 0
    i = 0

    while y < 6
      row = ""
      x = 0

      while x < 7
        p = ((prevLastDate.date() - prevLastDate.day()) + i + 1)
        n = p - prevLastDate.date()
        c = (if (x is 6) then "sun" else ((if (x is 5) then "sat" else "day")))
        date = @date.clone().date(n)

        # If value is outside of bounds its likelym previous and next months
        if n >= 1 and n <= lastDate.date()

          # Test to see if it's today
          c += (if (today.diff(date) is 0) then " today" else "")

          # Test against selected date
          c += (if (date.diff(@selectedDate) is 0) then " selected" else " ")  if @selectedDate
        else if n > lastDate.date() and x is 0
          break
        else
          c = ((if (x is 6) then "sun" else ((if (x is 5) then "sat" else "day")))) + " others"
          n = (if (n <= 0) then p else ((p - lastDate.date()) - prevLastDate.date()))

        if moment.isMoment(@opts.disableBefore)
          until_ = moment(@opts.disableBefore, "YYYY-MM-DD")
          c += (if (date.diff(until_) < 0) then " disabled" else "")

        if moment.isMoment(@opts.disableAfter)
          until_ = moment(@opts.disableAfter, "YYYY-MM-DD")
          c += (if (date.diff(until_) > 0) then " disabled" else "")

        # Create the cell
        row += """
            <td class='datepicker-day'>
              <a href="javascript:;" class="#{c}" data-date="#{date.format('YYYY-MM-DD')}">
                #{n}
              </a>
            </td>
            """
        x++
        i++

      # Create the row
      if row
        days += """
            <tr class="days">#{row}</tr>
            """
      y++
    return days

  _formatTitle: (viewDate) ->
    viewDate.format('YYYY MMMM')

  _setPosition: ->
    offset = @el.offset()
    @cal.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @el.outerHeight(true)

  _updateDate: ->
    @el.val @date.format(@opts.format)
    @el.trigger('change').blur()
    @trigger 'select', [@date]

  setDate: (date) ->
    @date = if moment.isMoment(date) then date else moment(date, @opts.format)

    @_refresh()
    @el.val @date.format(@opts.format)

  getDate: ->
    if @el.val()
      @date ||= moment(@el.val(), @opts.format)
    else
      null

  clear: ->
    @el.val ''
    @date = moment()
    @_refresh()

  destroy: ->
    @cal?.remove()
    @cal = null

datepicker = (opts) ->
  return new Datepicker opts
