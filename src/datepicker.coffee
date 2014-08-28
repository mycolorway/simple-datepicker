class Datepicker extends Widget
  opts:
    el: null
    inline: false
    showPrevNext: true
    disableBefore: null
    disableAfter: null
    format: "YYYY-MM-DD"
    width: null
    month: null


  _init: () ->
    @el = $(@opts.el)

    unless @el.length
      throw "simple datepicker: option el is required"
      return

    val = @el.val()
    @selectedDate = moment.tz(val, @opts.format, simple.tz) if val
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
        @_hide()


  # Show the calendar
  _show: ->
    @update @opts.month


  # Hide the calendar
  _hide: ->
    if @cal
      @cal.remove()
      @cal = null
      $(document).off ".datepicker"


  # Render the calendar
  update: (date) ->
    today = moment.tz(simple.tz).startOf("day")

    # Get the current date to render
    theDate = date or @el.data("theDate") or @selectedDate or today

    # Save current date
    @el.data "theDate", theDate

    calendar = @_renderCal(theDate)

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

      .on "click", ".datepicker-prev a", (e) =>
        btn = $(e.currentTarget)
        date = @el.data("theDate")
        newDate = date.clone().add("months", -1)

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
        date = moment.tz(btn.data("date"), "YYYY-MM-DD", simple.tz)

        # Save the new date and update the target control
        @el.data "theDate", date
        @el.val date.format(@opts.format)

        # Save selected
        @selectedDate = date
        @cal.find(".datepicker-day a.selected").removeClass "selected"
        btn.addClass "selected"

        # Hide calendar
        @_hide()  unless @opts.inline

        @cal.trigger "select.datepicker", [date, btn]


    @cal.css "width", @opts.width  if @opts.width
    @cal.html calendar
    @cal.trigger "beforeUpdate.datepicker", [@cal]



  _renderCal: (theDate) ->
    today = moment.tz(simple.tz).startOf("day")

    # Calculate the first and last date in month being rendered.
    # Also calculate the weekday to start rendering on
    firstDate = theDate.clone().startOf("month")
    lastDate = theDate.clone().endOf("month")

    # Calculate the last day in previous month
    prevLastDate = theDate.clone().add("months", -1).endOf("month")

    # The month names to show in toolbar
    monthNames = [
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

          if moment.isMoment(@opts.disableBefore)
            until_ = moment.tz(@opts.disableBefore, "YYYY-MM-DD", simple.tz)
            c += (if (date.diff(until_) < 0) then " disabled" else "")

          if moment.isMoment(@opts.disableAfter)
            until_ = moment.tz(@opts.disableAfter, "YYYY-MM-DD", simple.tz)
            c += (if (date.diff(until_) > 0) then " disabled" else "")

          # Test against selected date
          c += (if (date.diff(@selectedDate) is 0) then " selected" else " ")  if @selectedDate
        else if n > lastDate.date() and x is 0
          break
        else
          c = ((if (x is 6) then "sun" else ((if (x is 5) then "sat" else "day")))) + " others"
          n = (if (n <= 0) then p else ((p - lastDate.date()) - prevLastDate.date()))

        # Create the cell
        row += "<td class='datepicker-day'><a href='javascript:;' class='" + c + "' data-date='" + date.format("YYYY-MM-DD") + "'>" + n + "</div></td>"
        x++
        i++

      # Create the row
      days += "<tr class='days'>" + row + "</tr>"  if row
      y++

    # Determine whether to show Previous arrow
    showP = showN = true

    # Force override to showPrevNext on false
    showP = showN = false  unless @opts.showPrevNext

    # Build the html for the control
    titleMonthYear = theDate.year() + "年" + monthNames[theDate.month()]
    calendar = "<table class='calendar'>" + "<tr>" + "<td class='datepicker-prev'>" \
      + ((if showP then "<a href='javascript:;' class='fa fa-chevron-left'></a>" else "")) \
      + "</td>" + "<td class='datepicker-title' colspan='5'>" + titleMonthYear + "</td>" + "<td class='datepicker-next'>" \
      + ((if showN then "<a href='javascript:;' class='fa fa-chevron-right'></a>" else "")) \
      + "</td>" + "</tr>" + "<tr class='datepicker-dow'>" + "<td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td>" \
      + "</tr>" + days + "</table>"

    return calendar


  # Set a new selected date
  setSelectedDate: (date) ->
    unless date
      @selectedDate = null
      @el.val ""
    else
      @selectedDate = moment.tz(date, simple.tz)
      @el.val @selectedDate.format(@opts.format)
      @el.removeData "theDate"

    @cal and @update()



@simple ||= {}

$.extend @simple,
  datepicker: (opts) ->
    return new Datepicker opts
