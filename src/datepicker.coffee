class Datepicker extends SimpleModule
  opts:
    el: null
    inline: false
    showPrevNext: true
    showYearPrevNext: true
    disableBefore: null
    disableAfter: null
    format: 'YYYY-MM-DD'
    width: null
    viewDate: null
    viewType: 'calendar'
    monthOnly: false

  _init: () ->
    @el = $(@opts.el)

    unless @el.length
      throw 'simple datepicker: option el is required'
      return

    @opts.format = 'YYYY-MM' if @opts.monthOnly

    @_render()

  _render: () ->
    if @opts.inline
      @_show()
    else
      @el.on 'focus click', (e) =>
        @_show()

      $(document).on "click.datepicker", (e) =>
        @_hide() unless @el.is(e.target) or @el.has(e.target).length

  _show: ->
    val = @el.val()
    @selectedDate = moment(val, @opts.format) if val

    @_viewType = if @opts.monthOnly then 'yearmonth' else @opts.viewType
    @_viewDate = @opts.viewDate || @selectedDate || moment().startOf('day')

    @update()

  _hide: ->
    if @cal
      @cal.remove()
      @cal = null

  update: (date, type) ->
    type or= @_viewType
    date or= @_viewDate

    unless @cal
      @cal = $('<div class="simple-datepicker"></div>')
      if @opts.inline
        @cal.insertAfter @el
      else
        $('body').append @cal
        @_setPosition()

      @cal.data('datepicker', @)
      @cal.css("width", @opts.width) if @opts.width

      @_bindEvent()

    panel = switch type
      when 'yearmonth' then @_renderYearMonth date
      else @_renderCal date

    @cal.html panel
    @_calendar = @cal.find('.calendar')
    @_yearmonth = @cal.find('.datepicker-yearmonth').data('tmpDate', date.clone().startOf('month'))
    @_viewType = type
    @_viewDate = date

    if @opts.monthOnly and type == 'yearmonth'
      @cal.find('.datepicker-yearmonth-confirm').remove()

  _bindEvent: ->
    @cal
    .on 'mousedown click', (e) ->
      return false

    .on 'click', '.datepicker-title', (e) =>
      @update null, 'yearmonth'

    .on 'click', '.datepicker-prev, .datepicker-next', (e) =>
      e.preventDefault()

      direction = if $(e.currentTarget).is('.datepicker-prev') then -1 else 1
      date = @_viewDate.clone().add(direction, 'months')
      @update(date)

    .on 'click', '.datepicker-day a', (e) =>
      e.preventDefault()

      btn = $(e.currentTarget)
      return if btn.hasClass('disabled')

      @cal.find('.datepicker-day a.selected').removeClass('selected')
      btn.addClass('selected')

      date = moment(btn.data('date'), 'YYYY-MM-DD')
      @setSelectedDate date
      @_hide() unless @opts.inline

    .on 'click', '.datepicker-yearmonth-cancel, .datepicker-yearmonth-title', (e) =>
      return if @opts.monthOnly
      @update null, 'calendar'

    .on 'click', '.datepicker-yearmonth-ok', (e) =>
      e.preventDefault()

      date = @_yearmonth.data('tmpDate')
      @update date, 'calendar'

    .on 'click', '.datepicker-year-prev, .datepicker-year-next', (e) =>
      e.preventDefault()

      btn = $(e.currentTarget)
      currentYear = @_yearmonth.data('tmpDate').year()
      direction = if btn.is('.datepicker-year-prev') then -10 else 10
      firstYear = @cal.find('.datepicker-year a:first').data('year')*1 + direction

      years = @_renderYearSelectors firstYear, currentYear
      @cal.find('.datepicker-year-list').html years

    .on 'click', '.datepicker-year a, .datepicker-month a', (e) =>
      e.preventDefault()

      btn = $(e.currentTarget)
      date = @_yearmonth.data('tmpDate')
      isYear = btn.is('.datepicker-year a')

      if isYear
        date.set('year', btn.data('year')*1)
      else
        date.set('month', btn.data('month')*1)

      @_yearmonth.data('tmpDate', date)

      btn.parent().siblings().find('a.selected').removeClass('selected')
      btn.addClass('selected')

      @cal.find('.datepicker-yearmonth-title').html @_formatTitle(date)

      unless isYear
        if @opts.monthOnly
          @setSelectedDate date
          @_hide() unless @opts.inline
        else
          @update(date, 'calendar')


  _renderCal: (viewDate) ->
    prev = ''
    next = ''

    if @opts.showPrevNext
      prev = '<a href="javascript:;" class="fa fa-chevron-left datepicker-prev"></a>'
      next = '<a href="javascript:;" class="fa fa-chevron-right datepicker-next"></a>'

    title = @_formatTitle viewDate

    return """
      <table class="calendar">
        <tr>
          <td colspan="7">
            #{ prev }
            <a href="javascript:;" class="datepicker-title">#{ title }</a>
            #{ next }
          </td>
        </tr>
        <tr class="datepicker-dow">
          <td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>
        </tr>
        #{ @_renderDaySelectors viewDate }
      </table>
    """

  _renderYearMonth: (viewDate) ->
    prev = ''
    next = ''

    if @opts.showYearPrevNext
      prev = '<a href="javascript:;" class="fa fa-chevron-left datepicker-year-prev"></a>'
      next = '<a href="javascript:;" class="fa fa-chevron-right datepicker-year-next"></a>'

    title = @_formatTitle viewDate

    currentYear = viewDate.year()
    currentMonth = viewDate.month()

    return """
      <div class="datepicker-yearmonth">
        <table>
          <tr>
            <td>
              #{ prev }
              <a class="datepicker-yearmonth-title" href="javascript:;">#{ title }</a>
              #{ next }
            </td>
          </tr>
        </table>
        <div class="datepicker-year-container">
          <ul class="datepicker-year-list">#{ @_renderYearSelectors(currentYear-5, currentYear if @selectedDate) }</ul>
        </div>
        <div class="datepicker-month-container">
          <ul class="datepicker-month-list">#{ @_renderMonthSelectors(currentMonth if @selectedDate) }</ul>
        </div>
        <div class="datepicker-yearmonth-confirm">
          <a href="javascript:;" class="datepicker-yearmonth-ok">确定</a>
          <a href="javascript:;" class="datepicker-yearmonth-cancel">取消</a>
        </div>
      </div>
    """

  _renderYearSelectors: (firstYear, selectedYear) ->
    years = ''

    for y in [firstYear...firstYear + 10]
      years += """
        <li class="datepicker-year">
          <a href="javascript:;" class="#{ if y is selectedYear then 'selected' else '' }" data-year="#{ y }">
            #{ y }
          </a>
        </li>
      """

    return years

  _renderMonthSelectors: (selectedMonth) ->
    months = ''

    for m in [0..11]
      months += """
        <li class="datepicker-month">
          <a href="javascript:;" class="#{ if m is selectedMonth then 'selected' else '' }" data-month="#{ m }">
            #{ moment.monthsShort()[m] }
          </a>
        </li>
      """

    return months

  _renderDaySelectors: (theDate) ->
    today = moment().startOf("day")

    # Calculate the first and last date in month being rendered.
    # Also calculate the weekday to start rendering on
    firstDate = theDate.clone().startOf("month")
    lastDate = theDate.clone().endOf("month")

    # Calculate the last day in previous month
    prevLastDate = theDate.clone().add(-1, "months").endOf("month")

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
        date = theDate.clone().date(n)

        # If value is outside of bounds its likely previous and next months
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
    viewDate.format('YYYY年M月')

  _setPosition: ->
    offset = @el.offset()
    @cal.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @el.outerHeight(true)

  setSelectedDate: (date) ->
    unless date
      @selectedDate = null
      @el.val ""
    else
      date = moment(date, @opts.format)
      @selectedDate = date
      @_viewDate = date
      @el.val date.format(@opts.format)

    @cal and @update(date)
    @trigger 'select', [date]

datepicker = (opts) ->
  return new Datepicker opts
