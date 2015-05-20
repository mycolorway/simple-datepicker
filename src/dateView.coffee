class DateView extends View
  name: 'date'

  opts:
    el: null
    disableBefore: null
    disableAfter: null

  _inputTpl: '<input type="text" class="date-input" data-type="date" data-min="1"/>'


  _renderPanel: ->
    week = ''
    for i in [1, 2, 3, 4, 5, 6 ,0]
      week += "<td>#{moment.weekdaysMin(i)}</td>"
    return """
      <div class="panel panel-date">
        <div class="calendar-menu">
          #{ @_renderDayMenu() }
        </div>
        <table class="calendar" data-month="#{@date.format 'YYYY-MM'}">
          <tr class="datepicker-dow">
            #{week}
          </tr>
          #{ @_renderDaySelectors() }
        </table>
      </div>
    """

  _renderDayMenu: ->
    return """
      <a class="menu-item" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a>
      <a class="menu-item" data-action="next"><i class="icon-chevron-left"><span>&gt;</span></i></a>
    """


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
              <a href="javascript:;" class="#{c}" data-value="#{date.get('date')}">
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

  _prepareAction: ->
    @action = []

    f = (action) =>
      direction = if action is 'prev' then -1 else 1
      @date.add(direction, 'month')

      @_reRenderPanel()
      @panel.addClass('active')

      @_picker.trigger 'refresh',
        source: 'date'

    @action['prev'] = f
    @action['next'] = f

  _onInputHandler: ->
    value = @input.val()
    max = @date.endOf('month').date()
    if Number(value) > max
      @input.val value.substr(1)
    else if value.length is 2 and Number(value) > 0 and Number(value) < max
      @date.set 'date', value
      @refreshView()
      @panel.find('a.selected').removeClass 'selected'
      @panel.find("a[data-value=#{value}]").addClass 'selected'
      @_picker.trigger 'finish',
        panel: 'date'

  refreshView: ->
    return if @panel.find('table.calendar').data('month') is @date.format('YYYY-MM')
    @_reRenderPanel()

  setActive: (active) ->
    super(active)

    if active
      @refreshView()
      @panel.addClass 'active'

Datepicker.addView(DateView)
