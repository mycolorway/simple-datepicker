class View extends SimpleModule

  opts:
    el: null # bind parent element

  _itemTpl: '<a class="panel-item"></a>'
  _inputTpl: '<input/>'
  _panelTpl: '<div class="panel"></div>'

  _init: ->
    # store parent el
    @_header = @opts.el._header
    @_panel = @opts.el._panel
    @_picker = @opts.el
    @date = @opts.el.date

    @_render()
    @_bindPanel()
    @_bindInput()
    @_prepareAction()

  _render: ->
    @input = $(@_renderInput())
    @panel = $(@_renderPanel())

    $(@_header).append(@input)
    $(@_panel).append(@panel)

  _bindPanel: ->
    @panel.on 'click', 'a', (e) =>
      @_onClickHandler(e)

  _bindInput: ->
    @input.off('focus').on 'focus', =>
      @panel.addClass 'active'
      @_picker.trigger 'panelchange',
        panel: @name

    @input.on 'keydown', (e) =>
      @_onKeydownHandler(e)

    @input.on 'input', (e) =>
      @_onInputHandler(e)


  _onClickHandler: (e) ->
    $target = $(e.currentTarget)
    value = $target.data 'value'
    if value
      @date.set(@name, value)
      @panel.find('a.selected').removeClass 'selected'
      @panel.find("a[data-value=#{value}]").addClass 'selected'
      @refreshInput()
      @_picker.trigger 'finish',
        panel: @name
        value: value
    else
      action = $target.data 'action'
      @action[action](action)

  _onKeydownHandler: (e) ->
    key = e.which
    value = @input.val()
    type = @input.data 'type'
    min = @input.data 'min'
    max = @input.data 'max'
    max = @date.endOf('month').date() unless max #only for DateView TODO!!

    if key is 9 #tab
      @date.set @name, value
      @refreshView()
      @_picker.trigger 'finish',
        panel: @name
    else if key is 13 #enter
      @date.set @name, value
      @_picker.trigger 'finish',
        panel: @name
        completed: true
    else if key is 38 or key is 40
      direction = if key is 38 then 1 else -1
      value = Number(value) + direction
      value = max if value < min
      value = min if value > max
      @input.val value
      @date.set @name, value
      @_picker.trigger 'refresh',
        source: @name
    else if [48..57].indexOf(key) isnt -1
      return
    else if [8, 46, 37, 39].indexOf(key) isnt -1
      return
    else if key is 27
      @_picker.trigger 'close'

    e.preventDefault()

  _onInputHandler: (e) ->

  _prepareAction: ->

  _renderInput: ->
    @_inputTpl

  _renderPanel: ->
    @_panelTpl

  _reRenderPanel: (opt) ->
    @panel.replaceWith $(@_renderPanel(opt))
    @panel = @_panel.find ".panel-#{@name}"
    @_bindPanel()

  setActive: (active = true) ->
    if active
      @input.focus()
    else
      @panel.removeClass 'active'

  #new date to refresh input
  refreshInput: ->
    value = @date.get @name
    @input.val value

  #new date to refresh panel
  refreshView: ->
    @panel.find('a.selected').removeClass 'selected'
    @panel.find("a[data-value=#{@date.get(@name)}]").addClass 'selected'