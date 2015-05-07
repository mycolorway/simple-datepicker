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
    val = @el.val() || moment().startOf(if @opts.monthpicker then 'month' else 'day')
    @date = if moment.isMoment(val) then val else moment(val, @opts.format)

    @_renderPanel()
    @_bind()

    if @el.val().length
      @_day.focus()
    else
      @_year.focus()

  _bind: ->
    @_bindMouse()
    @_bindKey()

  _bindMouse: ->
    @cal.on 'mousedown click', ->
      false

    #bind for header
    @cal.on 'click', 'input', (e) ->
      $(e.currentTarget).focus()

    @cal.on 'focus', 'input', (e) =>
      $input = $(e.currentTarget)
      type = $input.data 'type'

      @setActive(type)

    #bind for year
    @cal.on 'click', '.panel-year p', (e) =>
      $target = $(e.currentTarget)
      year = $target.data 'year'

      if ['prev', 'next'].indexOf(year) is -1
        @date.year year
        @_year.val year
        @_yearSelector.find('.selected').removeClass 'selected'
        @_yearSelector.find("[data-year=#{year}]").addClass 'selected'
        @_month.focus()
      else
        from = @_yearSelector.find('p:not(.menu-item)').eq(0).data 'year'
        from = if year is 'prev' then from-10 else from+10

        @_yearSelector.replaceWith(@_renderYearSelector(from))
        @_yearSelector = @cal.find '.panel-year'
        @_yearSelector.addClass 'active'

    #bind for month
    @cal.on 'click', '.panel-month p', (e) =>
      $target = $(e.currentTarget)
      month = $target.data 'month'
      @date.month month
      @_monthSelector.find('.selected').removeClass 'selected'
      @_monthSelector.find("[data-month=#{month}]").addClass 'selected'

      unless @opts.monthpicker
        @_calendar.replaceWith(@_renderCal())
        @_calendar = @cal.find('.panel-day')

      @_month.val(Number(month)+1)
      if @opts.monthpicker
        @_select()
      else
        @_day.focus()

    #bind for calendar
    @cal.on 'click', '.panel-day a', (e) =>
      e.preventDefault()

      btn = $(e.currentTarget)
      return if btn.hasClass('disabled')

      @date = moment(btn.data('date'), 'YYYY-MM-DD')
      @_day.val(@date.date())
      @_select()

    @cal.on 'click', '.panel-day .menu-item', (e) =>
      $target = $(e.currentTarget)
      direction = if $target.is '.prev' then -1 else 1
      @date.add('month', direction)

      @_refresh(true)
      @cal.find('.panel-day').addClass 'active'

  _bindKey: ->
    @cal.on 'keydown', '.datepicker-header input', (e)=>
      key = e.which
      $input = $(e.currentTarget)
      value = $input.val()
      type = $input.data 'type'
      min = $input.data 'min'
      max = $input.data 'max'
      max = @date.endOf('month').date() unless max

      if key is 9 #tab
        @_update()
        $next = if e.shiftKey then $input.prevAll('input:first') else $input.nextAll('input:first')
        if $next.length
          $next.focus()
        else
          @_select()
      else if key is 13 #enter
        @_update()
        @_select()
      else if key is 38 or key is 40
        direction = if key is 38 then 1 else -1
        value = Number(value) + direction
        value = max if value < min
        value = min if value > max
        $input.val value
        @_update()
      else if [48..57].indexOf(key) isnt -1
        return
      else if [8, 46, 37, 39].indexOf(key) isnt -1
        return
      else if key is 27
        @_hide()
      e.preventDefault()

    @cal.on 'input', 'input', (e) =>
      $input = $(e.currentTarget)
      value = $input.val()

      switch $input.data('type')
        when 'year'
          $input.val value.substr(1) if value.length > 4
          value = $input.val()
          if value > 1900 and value < 2050
            @_update()
            @_month.focus()
        when 'month'
          $input.val($input.val().substr(1)) while Number($input.val()) > 12
          if value.length is 2
            @_update()
            unless @opts.monthpicker
              @_day.focus()
              return
            @_select()
        when 'day'
          max = @date.endOf('month').date()
          if Number(value) > max
            $input.val value.substr(1)

  #update date from input val
  _update: ->
    year = @_year.val()
    month = Number(@_month.val()) - 1
    day = @_day.val()

    @date.year year if year
    @date.month month if month
    @date.date day if day

    firstYear = @_yearSelector.find('p:not(.menu-item)').data 'year'
    if year < firstYear or year > firstYear+11
      firstYear = year - (year % 10)
      @_yearSelector.replaceWith(@_renderYearSelector(firstYear))
      @_yearSelector = @cal.find('.panel-year')


    @cal.find('.selected').removeClass 'selected'
    @_yearSelector.find("[data-year=#{year}]").addClass 'selected'
    @_monthSelector.find("[data-month=#{month}]").addClass 'selected'
    @_calendar.find("[data-date=#{@date.format('YYYY-MM-DD')}]").addClass('selected')



# refresh input val form new date
  _refresh: (all = false)->
    if all
      @_year.val @date.year()
      @_month.val @date.month()+1
      @_day.val @date.date() unless @opts.monthpicker

    @_calendar.replaceWith(@_renderCal())
    @_calendar = @cal.find('.panel-day')

    @cal.find('.selected').removeClass 'selected'
    @_yearSelector.find("[data-year=#{@date.year()}]").addClass 'selected'
    @_monthSelector.find("[data-month=#{@date.month()}]").addClass 'selected'
    @_calendar.find("[data-date=#{@date.format('YYYY-MM-DD')}]").addClass('selected')

  _select: ->
    @el.val @date.format(@opts.format)
    @el.trigger('change').blur()
    @trigger 'select', [@date]

    @_hide() unless @opts.inline

  _hide: ->
    if @cal
      @cal.remove()
      @cal = null

  _renderDayMenu: ->
    return """
      <div class="menu-item prev"><i class="icon-chevron-left"><span>&lt;</span></i></div>
      <div class="menu-item next"><i class="icon-chevron-left"><span>&gt;</span></i></div>
    """

  _renderCal: ->
    week = ''
    for i in [1, 2, 3, 4, 5, 6 ,0]
      week += "<td>#{moment.weekdaysMin(i)}</td>"
    return """
      <div class="panel panel-day">
        <div class="calendar-menu">
          #{ @_renderDayMenu() }
        </div>
        <table class="calendar">
          <tr class="datepicker-dow">
            #{week}
          </tr>
          #{ @_renderDaySelectors() }
        </table>
      </div>
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

  _setPosition: ->
    offset = @el.offset()
    @cal.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @el.outerHeight(true)

  _renderHeader: ->
    el = ''
    el += '<input type="text" class="year-input" data-type="year" data-min="1800" data-max="3000"/><span>年</span>'
    el += '<input type="text" class="month-input" data-type="month" data-min="1" data-max="12"/><span>月</span>'
    el += '<input type="text" class="day-input" data-type="day" data-min="1"><span>日</span>' unless @opts.monthpicker
    el

  _renderPanel: ->
    _calTemplate = """
      <div class="simple-datepicker">
        <div class="datepicker-header">
          #{@_renderHeader()}
        </div>
        <div class="datepicker-selector">
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

    @_selectors = @cal.find('.datepicker-selector')
    @_selectors.append(@_renderYearSelector())
    @_selectors.append(@_renderMonthSelector())
    @_selectors.append(@_renderCal()) unless @opts.monthpicker

    @_calendar = @cal.find('.panel-day')
    @_yearSelector = @cal.find('.panel-year')
    @_monthSelector = @cal.find('.panel-month')

    @_year = @cal.find('.year-input')
    @_month = @cal.find('.month-input')
    @_day = @cal.find('.day-input')

    unless @el.val() is ''
      @_year.val(@date.year())
      @_month.val(@date.month()+1)
      @_day.val(@date.date())


    @_monthSelector.find("[data-month='#{@date.month()}']").addClass 'selected'
    @_yearSelector.find("[data-year='#{@date.year()}']").addClass 'selected'

    if @opts.monthpicker
      @_calendar.remove()
      @cal.find('.day-input').remove()
    else
      @_calendar.find("[data-date=#{@date.format('YYYY-MM-DD')}]").addClass('selected')


  _renderYearSelector: (from) ->
    unless from
      from = Math.floor(moment().year()/10)*10

    el = '<div class="panel panel-year">'
    el+= '''
      <p class="datepicker-year menu-item" data-year="prev"><i class="icon-chevron-left"><span>&lt;</span></i></p><p class="datepicker-year menu-item" data-year="next"><i class="icon-chevron-right"><span>&gt;</span></i></p>
    '''
    for year in [from..from+11]
      el += "<p class='datepicker-year' data-year='#{year}'>#{year}</p>"

    el += '</div>'

  _renderMonthSelector: ->
    el = '<div class="panel panel-month">'

    for month in [1..12]
      el+= "<p class='datepicker-month' data-month='#{month-1}'>#{month}</p>"

    el += '</div>'

  setActive: (type) ->
    if type is 'day'
      @_calendar.replaceWith(@_renderCal())
      @_calendar = @cal.find('.panel-day')
    @cal.find('.panel').removeClass 'active'
    @cal.find(".panel-#{type}").addClass 'active'

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




