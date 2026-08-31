const router = require("express").Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();

router.route("/").get((req, res) => {
	res.status(200).json({ statusCode: 200, message: "Hello World" });
});

router.route("/checkUser").post((req, res) => {
	const token = req.body.token;
	if (!token) {
	return res.status(400).json({
		statusCode: 400,
		message: "Token required"
	});
}
	try {
		jwt.verify(token, process.env.PRIVATE_KEY_FARMERS);
		res.status(200).json({ statusCode: 200, user: "farmer" });
	} catch (err) {
		try {
			jwt.verify(token, process.env.PRIVATE_KEY_CONSUMERS);
			res.status(200).json({ statusCode: 200, user: "consumer" });
		} catch (err1) {
			res.status(200).json({ statusCode: 200, user: "guest" });
		}
	}
});

module.exports = router;
