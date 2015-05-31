
class Datepicker extends SimpleModule

  opts:
    list: ['year','%-',  'month', '%-', 'date']
    el: null
    inline: false
    valueFormat: 'YYYY-MM-DD'
    displayFormat: 'YYYY-MM-DD'
    defaultView: 'auto'
    viewOpts:
      date:
        disableBefore: null
        disableAfter: null

  # add constructor of view
  @addView: (view) ->
    unless @views
      @views = []
    @views[view::name] = view

  _init: ->
    @view = []
    @viewList = []

    @el = $(@opts.el)

    unless @el.length
      throw 'simple datepicker: option el is required'
      return

    @el.data 'datepicker', @
    val = @el.val() || moment()
    @date = if moment.isMoment(val) then val else moment(val, @opts.valueFormat)

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
    @headerContainer = @picker.find('.datepicker-header')
    @panelContainer = @picker.find('.datepicker-panels')
    @_renderViews()

    if @opts.inline
      @picker.insertAfter @el
      @show()
    else
      @_renderFakeInput()
      @picker.appendTo 'body'

  _renderFakeInput: ->
    type = @el.attr 'type'
    @input = $('<input />').addClass('display-input').attr
      'readonly': 'true'
      'type': type
    .css
      'cursor': 'pointer'

    @input.insertAfter @el
    @el.hide()

  _renderViews: ->
    for name in @opts.list
      if name.indexOf('%') is -1
        opt =
          parent: @
          inputContainer: @headerContainer
          panelContainer: @panelContainer
        opt.defaultValue = switch name
          when 'year'
            @date.year()
          when 'month'
            @date.month()+1
          when 'date'
            @date.format('YYYY-MM-DD')

        $.extend opt, @opts['viewOpts'][name] if @opts['viewOpts'][name]
        @view[name] = new @constructor.views[name](opt)
        @viewList.push name
        @_bindView(@view[name])
      else
        @headerContainer.append("<span>#{name.substr(1)}</span>")

  _setPosition: ->
    offset = @input.offset()
    @picker.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @input.outerHeight(true)

  _bind: ->
    @picker.on 'click mousedown', ->
      false

    return if @opts.inline
    @input.on 'focus.datepicker', =>
      @show()

    $(document).on 'click.datepicker', (e) =>
      return if @input.is e.target
      return if @picker.has(e.target).length
      return if @picker.is e.target
      @hide()

  _bindView: (view) ->
    view.on 'select', (e, event) =>
      source = event.source
      newDate = event.value

      if newDate.year
        @date.year newDate.year

      if newDate.month
        @date.month newDate.month-1

      if newDate.date
        @date = moment(newDate.date, 'YYYY-MM-DD')
        @view['year'].trigger 'datechange',
          year: @date.year()
        @view['month'].trigger 'datechange',
          month: @date.month()+1

      switch source
        when 'year', 'month'
          @view['date']?.trigger 'datechange',
            year: @date.year()
            month: @date.month()+1
        when 'date'
          @view['year'].trigger 'datechange',
            year: @date.year()
          @view['month'].trigger 'datechange',
            month: @date.month()+1

      if event.finished
        index = @viewList.indexOf(source)
        if index is @viewList.length-1
          # close panel
          @_selectDate()
        else
          @view[@viewList[index+1]].setActive()

    view.on 'showpanel', (e, event) =>
      source = event.source
      if event.prev
        #show prev view
        @view[source].setActive(false)
        index = @viewList.indexOf(source) - 1
        index = 0 if index < 0
        @view[@viewList[index]].setActive()

      else
        for name in @viewList
          @view[name].setActive(false) unless name is source

    view.on 'close', (e, event) =>
      if event?.selected
        @_selectDate()
      @hide() unless @opts.inline

  _selectDate: ->
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @trigger 'select', [@date]
    @hide() unless @opts.inline

  setDate: (date) ->
    @date = if moment.isMoment(date) then date else moment(date, @opts.valueFormat)
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @view['year']?.trigger 'datechange', {year: @date.year()}
    @view['month']?.trigger 'datechange', {month: @date.month()+1}
    @view['date']?.trigger 'datechange',
      year: @date.year()
      month: @date.month()+1
      date: @date.format('YYYY-MM-DD')

  clear: ->
    @el.val ''
    @date = moment()
    for name in @viewList
      @view[name].clear()

  getDate: ->
    if @el.val()
      @date ||= moment(@el.val(), @opts.valueFormat)
    else
      null

  show: ->
    @_setPosition() unless @opts.inline

    @picker.show()
    @picker.addClass 'active'
    view = @opts.defaultView

    if @viewList.indexOf(view) isnt -1
      @view[view].setActive()
    else
      #deafultView is 'auto'
      if @el.val() isnt '' and @view['date']
        @view['date'].setActive()
      else
        @view[@viewList[0]].setActive()

  hide: ->
    @picker.hide()
    @picker.removeClass 'active'

  toggle: ->
    if @picker.is '.active'
      @hide()
    else
      @show()

  destroy: ->
    @picker?.remove()
    @picker = null

    unless @opts.inline
      @input.remove()
      @el.show()
      $(document).off '.datepicker'


datepicker = (opts) ->
  return new Datepicker opts

datepicker.View = View;


