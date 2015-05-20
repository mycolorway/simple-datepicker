class YearView extends View
  name: 'year'

  _inputTpl: '<input type="text" class="year-input" data-type="year" data-min="1800" data-max="3000"/>'


  _renderPanel: (from)->
    unless from
      from = Math.floor(@date.year()/10)*10

    el = """
      <div class="panel panel-year">
        #{@_renderYears(from)}
      </div>
    """

  _renderYears: (from) ->
    el = '''
        <a class="panel-item menu" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a><a class="panel-item menu" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>
    '''

    for year in [from..from+11]
      el += "<a class='panel-item' data-value='#{year}'>#{year}</a>"

    el

  _prepareAction: ->
    @action = []
    f = (action) =>
      from = @panel.find('.panel-item:not(.menu)').eq(0).data 'value'
      from = if action is 'prev' then from-10 else from+10

      @_reRenderPanel(from)
      @panel.addClass('active')


    @action['prev'] = f
    @action['next'] = f

  _onInputHandler: ->
    value = @input.val()
    @input.val value.substr(1) if value.length > 4

    value = @input.val()
    if value > 1900 and value < 2050
      @date.set 'year', value
      @refreshView()
      @_picker.trigger 'finish',
        panel: 'year'

  @_reRenderPanel: ->
    newFrom = Math.floor(@date.year()/10)*10
    from = @panel.find('.panel-item:not(.menu)').eq(0).data 'value'
    return if newFrom is from

    super()

  refreshView: ->
    @_reRenderPanel()

    super()

Datepicker.addView(YearView)
