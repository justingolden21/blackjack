// must have jquery and font awesome
// call this function on page load
function setupCheckboxes() {
	$('input[type=checkbox]').each(function() {
		$(this).after('<i></i>');
		if($(this).is(':checked') )
			$(this).next().removeClass().addClass('fas fa-check-square');
		else
			$(this).next().removeClass().addClass('far fa-square');
	});
	$('input[type=checkbox]').change(function() {
		$(this).next().toggleClass('fas').toggleClass('far').toggleClass('fa-check-square').toggleClass('fa-square');
	});
	$('input[type=checkbox]').focus(function() {
		$(this).next().css('background-color','hsl(160, 50%, 80%)');
	});
	$('input[type=checkbox]').focusout(function() {
		$(this).next().css('background-color','');
	});
	$('input[type=checkbox]').css('cursor', 'pointer');
	$('label input[type=checkbox]').css('cursor', 'pointer');
	$('input[type=checkbox]').css('opacity', '0');
	$('input[type=checkbox]').css('margin-top', '5px');
	$('input[type=checkbox]').css('position', 'absolute');

	// update display if they change the checkbox value programmatically
	// even if they use code like:
	// $('#myCheckbox').prop('checked', true);
	// instead of
	// $('#myCheckbox').change();
	$.propHooks.checked = {
		set: function (el, value) {
			if (el.checked !== value) {
				el.checked = value;
				$(el).trigger('change');
			}
		}
	};
}

//  manually update checkboxes if checked property is changed some other way
function updateCheckboxes() {
	$('input[type=checkbox').each(function() {
		if($(this).is(':checked') )
			$(this).next().removeClass().addClass('fas fa-check-square');
		else
			$(this).next().removeClass().addClass('far fa-square');
	});
}