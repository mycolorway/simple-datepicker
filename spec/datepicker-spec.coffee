
describe 'Simple Datepicker', ->

  it 'should inherit from SimpleModule', ->
    datepicker = simple.datepicker
      el: $("body")
    expect(datepicker instanceof SimpleModule).toBe(true)
