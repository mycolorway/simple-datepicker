
describe 'Simple Datepicker', ->

	it 'should inherit from SimpleModule', ->
		datepicker = simple.datepicker
			el: $("body")
		expect(datepicker instanceof SimpleModule).toBe(true)

	describe 'Date selecting', ->
		date = null
		desiredDate = null
		beforeEach (done)->
			$('.simple-datepicker').remove()
			inline_datepicker = simple.datepicker
				el: $("body")
				inline: true
			inline_datepicker.on 'select', (e,_date) ->
				date = _date
				done()
			today = moment()
			desiredDate = today.clone().add('month', -1).set('date', 15).format('YYYY-MM-DD')
			$('.simple-datepicker .datepicker-prev a').trigger('click')
			$('.simple-datepicker .datepicker-day a').each ->
				if $(this).text()*1 is 15
					$(this).trigger('click')
					return false

		it 'should set date to 15th of last month', (done)->
			expect(date).toEqual(desiredDate)
			done()

	describe 'Quick Year&Month selecting', ->
		date = null
		beforeEach (done)->
			$('.simple-datepicker').remove()
			inline_datepicker = simple.datepicker
				el: $("body")
				inline: true
			inline_datepicker.on 'select', (e,_date) ->
				date = _date
				done()
			today = moment()
			$('.simple-datepicker .datepicker-title a').trigger('click')
			while $($('.simple-datepicker .datepicker-yearmonth .datepicker-year a').get(0)).text()*1 > 1998
				$('.simple-datepicker .datepicker-yearmonth .datepicker-year-prev a').trigger('click')
			while $($('.simple-datepicker .datepicker-yearmonth .datepicker-year a').get(-1)).text()*1 < 1998
				$('.simple-datepicker .datepicker-yearmonth .datepicker-year-next a').trigger('click')
			$('.simple-datepicker .datepicker-yearmonth .datepicker-year a').each ->
				if $(this).text()*1 is 1998
					$(this).trigger('click')
					return false
			$($('.simple-datepicker .datepicker-yearmonth .datepicker-month a').get(2)).trigger('click')
			$('.simple-datepicker .datepicker-yearmonth .datepicker-yearmonth-ok').trigger('click')
			$('.simple-datepicker .datepicker-day a').each ->
				if $(this).text()*1 is 15
					$(this).trigger('click')
					return false

		it 'should set date to March 15th, 1998', (done)->
			expect(date).toEqual('1998-03-15')
			done()

	afterEach ->
		$('.simple-datepicker').remove()