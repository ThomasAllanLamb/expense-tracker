var express = require('express');
var router = express.Router();
var Datastore = require('nedb');

var expenses = new Datastore();

router.get('/expenses', function(req, res, next) {
	expenses.find({}, function (err, docs) {
		res.json(docs);
	});
});

router.post('/expenses', function(req, res, next) {
	if (
		req.body.quantity !== undefined
		&&	req.body.description !== undefined
		&&	req.body.date !== undefined
	) {
		//data is good.
		expenses.insert(
			{
				quantity: req.body.quantity,
				description: req.body.description,
				date: req.body.date
			}
			, function (err, doc) {
				res.json({
					success:true
				});
			}
		);
	}
	else
	{
		//data is bad.
		res.json({success:false});	
	}
});

router.get('/expenseSearch/:query', function (req, res, next) {
	expenses.find(
		{
			description: {
				$regex: new RegExp(req.params.query)
			}
		}
		, function (err, docs) {
			res.json(docs);
		}
	);
});

router.get('/expenseSearch/', function (req, res, next) {
	expenses.find({}, function (err, docs) {
		res.json(docs);
	});
});

module.exports = router;