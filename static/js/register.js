$(document).ready(function() {
	/* Customer selection */
	$("li.customer").click( function() {
		/* Enable all buttons */
		$("li.customer").each(function(i) {
			$(this).removeClass("selected");
		});
		/* Disable the customer button just clicked */
		$(this).addClass("selected");
		/* Update the form */
		$("input[name=customer]").val($(this).children("span.name").text());
	});
	/* Product amount controls */
	$("li.product").click( function() {
		var form_field = $(this).children("input[type=text]");
		var qty = Number(form_field.val()) + 1;
		form_field.val(qty);
	});
	/* Also reset the hidden customer fields */
	$("input[type=reset]").click( function() {
		$("input[name=customer]").val("");
	});

	/* TODO: keyboard shortcuts */

});
