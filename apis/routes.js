const express = require("express");
const router = express.Router();
const parseXls = require("./parse-xls");

router.route("/parsexls").get(parseXls.test);

module.exports = router;
