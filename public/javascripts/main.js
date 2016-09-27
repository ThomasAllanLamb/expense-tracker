$(function () {
	var $view = $("#view");

	//prepend a given expense to the table
	function addExpense(expense)
	{
		var $tr = $("<tr><td>"+expense.description+"</td><td>"+expense.date+"</td><td>"+expense.quantity+"</td></tr>");
		$view.find("tbody").prepend($tr);
	}

	//set up form
	var $expenseForm = $("#newExpense");
	var $expenseFormSubmit = $expenseForm.find("#submitExpense");
	var onExpenseSubmit = function () {
		//disable submit button until we're ready for another one
		$expenseFormSubmit
			.off("click.submitForm")
			.prop("disabled", true)
		;

		//gather fields
		var $quantity = $expenseForm.find("#quantity");
		var $description = $expenseForm.find("#description");
		var $date = $expenseForm.find("#date");

		//post values to server
		$.post(
			"api/expenses"
			, {
				quantity: $quantity.val(),
				description: $description.val(),
				date: $date.val()
			},
			function (data, textStatus, jqXHR) {
				if (data.success === true)
				{
					//the expense has been entered into the database.

					//update the view
					//!!!:this assumes that the database cannot have changed by any other means. For example, if multiple clients start using this one database, then this assumption will no longer be true.
					addExpense({
						quantity: $quantity.val(),
						description: $description.val(),
						date: $date.val()
					});

					//clean form
					$quantity.val("");
					$description.val("");
					$date.val("");
				}

				//enable the submit button again
				$expenseFormSubmit
					.on("click.submitForm", onExpenseSubmit)
					.prop("disabled", false)
				;

				return;
			},
			"json"
		);

		//prevent default behavior
		return false;
	};
	$expenseFormSubmit.on("click.submitForm", onExpenseSubmit);

	//set up date picker
	$expenseForm.find("#date").pickadate();

	//set up searching
	$("#searchSubmit").on("click.search", function () {
		var query = $("#query").val();
		//empty table
		$view.find("tbody").html("");

		//request new results
		$.getJSON(
			"api/expenseSearch/"+query
			, {}
			, function (data, textStatus, jqXHR) {
				//add new results
				for (let expense of data)
				{
					addExpense(expense);
				}
			}
		);

		return false;
	});

	//fill table
	$.getJSON("api/expenses", {}, function (data, textStatus, jqXHR) {
		for (let expense of data)
		{
			addExpense(expense);
		}
	})
});