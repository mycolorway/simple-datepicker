class Datepicker extends SimpleModule
  opts:
    el: null
    inline: false
    showPrevNext: true
    showYearPrevNext: true
    disableBefore: null
    disableAfter: null
    format: "YYYY-MM-DD"
    width: null
    month: null

  @monthNames = [
    "1月"
    "2月"
    "3月"
    "4月"
    "5月"
    "6月"
    "7月"
    "8月"
    "9月"
    "10月"
    "11月"
    "12月"
  ]

  _init: () ->
    @el = $(@opts.el)

    unless @el.length
      throw "simple datepicker: option el is required"
      return

    val = @el.val()
    @selectedDate = moment(val, @opts.format) if val
    @_render()


  _render: () ->
    if @opts.inline
      @_show()
    else
      # Bind click and focus event to show
      @el.focus (e) =>
        @_show()
      .focus()

      # Bind click elsewhere to hide
      $(document).on "click.datepicker", (e) =>
        @_hide() unless @el.is(e.target) or @el.has(e.target).length


  # Show the calendar
  _show: ->
    @update @opts.month

  # Hide the calendar
  _hide: ->
    if @cal
      @cal.remove()
      @cal = null


  # Render the calendar
  update: (date, usage) ->
    today = moment().startOf("day")

    # Get the current date to render
    theDate = date or @el.data("theDate") or @selectedDate or today

    # Save current date
    @el.data "theDate", theDate

    usage ?= @_usage or 'calendar'

    panel = switch usage
      when 'yearmonth' then @_renderYearMonthSelector theDate
      else @_renderCal theDate

    unless @cal
      @cal = $("<div class='simple-datepicker'></div>").insertAfter @el
      @cal.data("datepicker", @)
      unless @opts.inline
        offset = @el.offset()
        @cal.css
          position: "absolute"
          "z-index": 100
          left: offset.left
          top: offset.top + @el.outerHeight(true)


      # Handle previous/next clicks
      @cal.on "mousedown", (e) ->
        return false

      .on "click", (e) ->
        return false

      .on "click", ".datepicker-title a", (e) =>
        @update null, 'yearmonth'

      .on "click", ".datepicker-prev a", (e) =>
        btn = $(e.currentTarget)
        date = @el.data("theDate")
        newDate = date.clone().add(-1, "months")

        # Save the new date and render the change
        @el.data "theDate", newDate
        @update()

      .on "click", ".datepicker-next a", (e) =>
        btn = $(e.currentTarget)
        date = @el.data("theDate")
        newDate = date.clone().add("months", 1)

        # Save the new date and render the change
        @el.data "theDate", newDate
        @update()

      .on "click", ".datepicker-day a", (e) =>
        e.preventDefault()
        btn = $(e.currentTarget)
        return  if btn.hasClass("disabled")
        day = btn.text()
        date = moment(btn.data("date"), "YYYY-MM-DD")

        # Save the new date and update the target control
        @el.data "theDate", date
        @el.val date.format(@opts.format)

        # Save selected
        @selectedDate = date
        @update()

        # Hide calendar
        @_hide()  unless @opts.inline

        @trigger "select", [date.format(@opts.format), btn]

      .on "click", ".datepicker-yearmonth-cancel,.datepicker-yearmonth-title a", (e) =>
        @update null, 'calendar'

      .on "click", ".datepicker-yearmonth-ok", (e) =>
        e.preventDefault()
        date = @el.data("theDate") or @selectedDate or moment().startOf("day")
        date = date.clone()
        selectedYear = @_yearmonth.data('year')*1
        selectedMonth = @_yearmonth.data('month')*1
        date.set('year', selectedYear)
        date.set('month', selectedMonth)

        # Save the new date and render the change
        @el.data "theDate", date
        @update null, 'calendar'

      .on "click", ".datepicker-yearmonth .datepicker-year-prev a,.datepicker-yearmonth .datepicker-year-next a", (e) =>
        e.preventDefault()
        currentYear = @_yearmonth.data('year')*1
        btn = $(e.currentTarget)
        year = $(@cal.find('.datepicker-yearmonth .datepicker-year a').get(0)).data('year')*1
        if isNaN year
          year = currentYear - 5
        else
          if btn.parent().hasClass 'datepicker-year-prev'
            year -= 10
          else
            year += 10
        years = @_renderYearSelectors [year..year+9], currentYear
        @cal.find('.datepicker-yearmonth .datepicker-year-list').html years

      .on "click", ".datepicker-yearmonth .datepicker-year a,.datepicker-yearmonth .datepicker-month a", (e) =>
        e.preventDefault()
        btn = $(e.currentTarget)
        li = btn.parent()
        if li.hasClass 'datepicker-year'
          year = btn.data('year')*1
          month = @_yearmonth.data('month')
          @_yearmonth.data('year', year)
        else
          month = btn.data('month')*1
          year = @_yearmonth.data('year')
          @_yearmonth.data('month', month)
        btn.parent().siblings().find('a.selected').removeClass('selected')
        btn.addClass('selected')
        @cal.find('.datepicker-yearmonth .datepicker-yearmonth-title a').html @_formatTitle year,month


    @cal.css "width", @opts.width  if @opts.width
    @cal.html panel
    @_calendar = @cal.find('.calendar')
    @_yearmonth = @cal.find('.datepicker-yearmonth')
    @trigger "beforeUpdate", [@cal]


  _renderCal: (theDate) ->
    @_usage = "calendar"

    # Determine whether to show Previous arrow
    showP = showN = true

    # Force override to showPrevNext on false
    showP = showN = false  unless @opts.showPrevNext

    # Build the html for the control
    calendar = """
      <table class="calendar">
        <tr>
          <td class="datepicker-prev">
            #{if showP then '<a href="javascript:;" class="fa fa-chevron-left"></a>' else ''}
          </td>
          <td class="datepicker-title" colspan="5">
            <a href="javascript:;">#{@_formatTitle theDate.year(), theDate.month()}</a>
          </td>
          <td class="datepicker-next">
            #{if showN then '<a href="javascript:;" class="fa fa-chevron-right"></a>' else ''}
          </td>
        </tr>
        <tr class="datepicker-dow">
          <td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>
        </tr>
        #{@_renderDaySelectors theDate}
      </table>
      """

    return calendar

  # render the year&month selector
  _renderYearMonthSelector: (theDate) ->
    @_usage = "yearmonth"
    showP = showN = true
    showP = showN = false  unless @opts.showYearPrevNext
    currentYear = theDate.year()
    currentMonth = theDate.month()

    return """
      <div class="datepicker-yearmonth" data-year="#{currentYear}" data-month="#{currentMonth}">
        <div class='datepicker-yearmonth-title'>
          <a href='javascript:;'>
            #{@_formatTitle currentYear, currentMonth}
          </a>
        </div>
        <div class="datepicker-year-container">
          #{if showP then '<div class="datepicker-year-prev"><a href="javascript:;" class="fa fa-chevron-up"></a></div>' else ''}
          <ul class="datepicker-year-list">#{@_renderYearSelectors [currentYear-5..currentYear+4], currentYear}</ul>
          #{if showN then '<div class="datepicker-year-next"><a href="javascript:;" class="fa fa-chevron-down"></a></div>' else ''}
        </div>
        <div class="datepicker-month-container">
          <ul class="datepicker-month-list">#{@_renderMonthSelectors currentMonth}</ul>
        </div>
        <div class="datepicker-yearmonth-confirm">
          <a href="javascript:;" class="datepicker-yearmonth-cancel">取消</a>
          <a href="javascript:;" class="datepicker-yearmonth-ok">确定</a>
        </div>
      </div>
      """

  # render year selector buttons of yearmonth
  _renderYearSelectors: (range, theYear) ->
    years = ''
    for _year in range
      years +=
        """
        <li class="datepicker-year">
          <a href="javascript:;" class="#{if _year is theYear then 'selected' else ''}" data-year="#{_year}">
            #{_year}
          </a>
        </li>
        """
    return years

  # render month selector buttons of yearmonth
  _renderMonthSelectors: (theMonth) ->
    months = ''
    for _month in [0..11]
      months +=
        """
        <li class="datepicker-month">
          <a href="javascript:;" class="#{if _month is theMonth then 'selected' else ''}" data-month="#{_month}">
            #{Datepicker.monthNames[_month]}
          </a>
        </li>
        """
    return months

  # render day selector buttons of calendar
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

  # format the title composed with year and month
  _formatTitle: (year, month) ->
    "#{year}年#{Datepicker.monthNames[month]}"


  # Set a new selected date
  setSelectedDate: (date) ->
    unless date
      @selectedDate = null
      @el.val ""
    else
      @selectedDate = moment(date, @opts.format)
      @el.val @selectedDate.format(@opts.format)
      @el.removeData "theDate"

    @cal and @update()


datepicker = (opts) ->
  return new Datepicker opts
