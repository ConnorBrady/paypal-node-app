const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQ3kySNwpS749YbdhMOw3QFo6Jb_lrc6uQIINmKGNBh61jLUt-TUsgnx0562yyRosCQ2VnocIPxy_WZZ',
    'client_secret': 'EB3zXGPEAD23UHVUKVniNSkeXW7iJJF4esj8RMrqo9ArYuXQB1JPeQuEXN7CErg2e0CpfCsFpPBsqDEA'
  });

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.sender('index'));

app.post('/pay', (req, res) => {
    const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3009/success",
        "cancel_url": "http://localhost:3009/failure"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "social medium sub per month",
                "sku": "item",
                "price": "20.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the monthly sub to the social network."
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i =0; i < payment.links.length; i++){
            if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
            }
        }
    }
});

});

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;


});

const execute_payment_json = {
    "payer_id": payerId,
    "transactions" : [{
        "amount": {
            "currency": "USD",
            "total": "20.00"
        }
    }]
};

paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        rese.send('success');
    }
});

app.get('/success', (req, res) => res.send ('cancel'));

app.listen(3009, () => console.log('Server Started'));

