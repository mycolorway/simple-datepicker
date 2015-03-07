class Datepicker extends SimpleModule
  opts:
    el: null
    inline: false
    disableBefore: null
    disableAfter: null
    format: 'YYYY-MM-DD'
    width: null
    monthpicker: false


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
    val = @el.val() || moment()
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
          <a href="javascript:;" class="datepicker-prev"><i class="icon-cheron-left"><span>&#10094;</span></i></a>
          <a href="javascript:;" class="datepicker-title">#{  @_formatTitle(@date) }</a>
          <a href="javascript:;" class="datepicker-next"><i class="icon-cheron-right"><span>&#10095;</span></i></a>
        </div>
      </div>
    """
    @cal = $(_calTemplate)
    if @opts.inline
      @cal.insertAfter @el
    else
      $('body').append @cal
      @_setPosition()

    @cal.data('datepicker', @)
    @cal.css("width", @opts.width) if @opts.width

    @cal.append(@_renderYearMonth())
    @cal.append(@_renderCal()) unless @opts.monthpicker

    @_calendar = @cal.find('.calendar')
    @_monthpicker = @cal.find('.datepicker-yearmonth')
    @_title = @cal.find('.datepicker-title')
    @yearContainer = @cal.find('.datepicker-year-container')

    if @opts.monthpicker
      @_monthpicker.show()
      @cal.find('.datepicker-header').remove() #header not show when monthpicker only
      #scrollTo now position
      year = @date.year()
      height = @_monthpicker.find('.datepicker-year').height()
      @yearContainer.scrollTop(height * (year - @firstYear))
    else
      @_calendar.find("[data-date=#{@date.format('YYYY-MM-DD')}]").addClass('selected')


  _bindEvent: ->
    @cal.on 'mousedown click', (e) ->
        false

    .on 'click', '.datepicker-title', (e) =>
      @cal.toggleClass('expanded') unless @opts.monthpicker

      year = @date.year()
      height = @_monthpicker.find('.datepicker-year').height()
      @yearContainer.scrollTop(height * (year - @firstYear))

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

    .on 'click', '.datepicker-year a', (e) =>
      $target = $(e.currentTarget)

      year = $target.data 'year'
      @date.year year
      @_refresh()

    .on 'click', '.datepicker-month a', (e) =>
      $target = $(e.currentTarget)

      month = $target.data 'month'
      @date.months month
      @_refresh()

      if @opts.monthpicker
        @_updateDate()
        @_hide() unless @opts.inline
      else
        @cal.removeClass 'expanded'

    @cal.find('.datepicker-year-container').scroll (e) =>
      scrollTop = $(e.target).scrollTop()

      if scrollTop + 80 +10 >= @yearContainer.children().height()
        @yearContainer.find('.datepicker-year-list').append(@_renderYearSelectors(@lastYear, @lastYear + 5))
        @lastYear = @lastYear + 5

      else if scrollTop is 0
        @yearContainer.find('.datepicker-year-list').prepend(@_renderYearSelectors(@firstYear-5, @firstYear))
        @firstYear = @firstYear-5
        height = @_monthpicker.find('.datepicker-year').height()
        @yearContainer.scrollTop(height * 5)


  _refresh: ->
    return unless @cal
    unless @opts.monthpicker
      @_calendar.replaceWith(@_renderCal())
      @_calendar = @cal.find('.calendar')

    @_title.text(@_formatTitle(@date))

    year = @date.year()
    month = @date.months()
    date = @date.format(@opts.format)

    @_monthpicker.find('.selected').removeClass('selected')
    @_monthpicker.find("[data-year=#{year}]").addClass('selected')
    @_monthpicker.find("[data-month=#{month}]").addClass('selected')
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
    noSelected = @opts.monthpicker and !@selectedDate

    currentYear = @date.year()
    currentMonth = @date.month()

    @firstYear = currentYear - 5
    @lastYear = currentYear + 10
    return """
      <div class="datepicker-yearmonth">
        <div class="datepicker-year-container">
          <ul class="datepicker-year-list">#{ @_renderYearSelectors(@firstYear, @lastYear, currentYear unless noSelected) }</ul>
        </div>
        <div class="datepicker-month-container">
          <ul class="datepicker-month-list">#{ @_renderMonthSelectors(currentMonth unless noSelected) }</ul>
        </div>
      </div>
    """

  _renderYearSelectors: (firstYear, lastYear, selectedYear) ->
    years = ''

    for y in [firstYear...lastYear]
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
            #{ moment.monthsShort(m) }
          </a>
        </li>
      """

    return months

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
