
class Datepicker extends  SimpleModule

  opts:
    list: ['year','%-',  'month', '%-', 'date']
    el: null
    inline: false
    format: 'YYYY-MM-DD'
    width: null
    date:
      disableBefore: null
      disableAfter: null

  @addView: (view) ->
    unless @panel
      @panel = []
    @panel[view::name] = view

  _init: ->
    @panels = []
    @list = []

    @el = $(@opts.el)

    unless @el.length
      throw 'simple datepicker: option el is required'
      return

    @opts.format = 'YYYY-MM' if @opts.monthpicker
    @el.data 'datepicker', @
    val = @el.val() || moment().startOf(if @opts.monthpicker then 'month' else 'day')
    @date = if moment.isMoment(val) then val else moment(val, @opts.format)

    @_render()
    @_bind()

  _render: ->
    tpl = '''
      <div class="simple-datepicker">
        <div class="datepicker-header">
        </div>
        <div class="datepicker-panels">
        </div>
      </div>
    '''
    @picker = $(tpl)
    @_header = @picker.find('.datepicker-header')
    @_panel = @picker.find('.datepicker-panels')
    @_renderPanels()

    if @opts.inline
      @picker.insertAfter @el
      @show()
    else
      @picker.appendTo 'body'
      @_setPosition()

  _renderPanels: ->
    for name in @opts.list
      if name.indexOf('%') is -1
        opt =
          el: @
        $.extend opt, @opts[name] if @opts[name]
        @panels[name] = new @constructor.panel[name](opt)
        @list.push name
      else
        @_header.append("<span>#{name.substr(1)}</span>")

  _setPosition: ->
    offset = @el.offset()
    @picker.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @el.outerHeight(true)

  _bind: ->
    unless @opts.inline
      @el.on 'focus', (e) =>
        @show()

      $(document).on "click.datepicker", (e) =>
        @hide() unless @el.is(e.target) or @picker.has(e.target).length

    @on 'finish', (e, event) =>
      panel = event.panel
      completed = event.completed
      index = @list.indexOf(panel)
      if completed or index is @list.length-1
        #@panels[panel].setActive(false)
        @_selectDate()
      else
        @trigger 'refresh',
          source: panel

        nextPanel = @list[index+1]
        @panels[panel].setActive(false)
        @panels[nextPanel].setActive(true)

    @on 'refresh', (e, event) =>
      source = event.source

      switch source
        when 'year'
          @panels['date'].refreshView() if @panels['date']
        when 'month'
          @panels['date'].refreshView() if @panels['date']
        when 'date'
          if @panels['year']
            @panels['year'].refreshInput()
            @panels['year'].refreshView()
          if @panels['month']
            @panels['month'].refreshInput()
            @panels['month'].refreshView()


    @on 'panelchange', (e, event) =>
      for panel in @list
        @panels[panel].setActive(false) if panel isnt event.panel

    @on 'close', (e) =>
      for panel in @list
        @panels[panel].setActive(false)
      @hide()

  setDate: (date)->
    @date = if moment.isMoment(date) then date else moment(date, @opts.format)
    for panel in @panels
      panel.refreshView()
      panel.refreshInput()
    @el.val @date.format(@opts.format)

  _selectDate: ->
    @el.val @date.format(@opts.format)
    @el.trigger('change').blur()
    @trigger 'select', [@date]
    @hide() unless @opts.inline

  show: ->
    @picker.show()
    @panels[@list[0]].setActive()

  hide: ->
    @picker.hide()



datepicker = (opts) ->
  return new Datepicker opts


