let express = require('express');
let axios = require('axios');
let router = express.Router();

router.post('/', async function (req, res) {
    try {
        let myres = {};
        let amountRes;

        let from = req.body.fromCur;
        let to = req.body.toCur;
        let amount = req.body.input;

        let response = await axios.get(
            'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11',
            {
                headers: {'Content-Type': 'application/json'}
            }
        );
        let courses = response.data;

        let fromCourse = courses.filter((el) => {
            return el.ccy === from;
        });
        fromCourse = fromCourse[0];

        let toCourse = courses.filter((el) => {
            return el.ccy === to;
        });
        toCourse = toCourse[0];

        fromCourse = fromCourse ? fromCourse : {buy: 1};
        toCourse = toCourse ? toCourse : {buy: 1};

        amountRes = fromCourse.buy * amount;
        amountRes = amountRes / toCourse.buy;

        myres = {
            from: from,
            to: to,
            amount: amount,
            amountRes,
        };
        res.json(myres);
    } catch (e) {
        res.json(e);
    }
});

module.exports = router;
