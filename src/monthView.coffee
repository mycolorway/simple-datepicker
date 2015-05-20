class MonthView extends View
  name: 'month'

  _inputTpl: '<input type="text" class="month-input" data-type="month" data-min="1" data-max="12"/>'


  _renderPanel: ->
    el = ''
    for month in [0..11]
      el += "<a class='panel-item' data-value='#{month}'>#{month+1}</a>"

    $(@_panelTpl).html(el).addClass 'panel-month'

  _onInputHandler: ->
    @input.val(@input.val().substr(1)) while Number(@input.val()) > 12
    value = @input.val()
    if value.length is 2
      @date.set 'month', Number(value)-1
      @refreshView()
      @_picker.trigger 'finish',
        panel: 'month'

  refreshInput: ->
    value = @date.get 'month'
    @input.val value+1


Datepicker.addView(MonthView)
