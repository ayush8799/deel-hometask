
module.exports = function(app) {
	app.get('/', function (req, res) {
		return res.send({
			head: {
				title: 'Deel Api'
			},
			content: {
				title: 'Deel API v1',
				description: 'Welcome to Deel API Server'
			}
		});
	});

}