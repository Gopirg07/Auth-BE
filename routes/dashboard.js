var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send({ success:10, pending:5 });
});

module.exports = router;
