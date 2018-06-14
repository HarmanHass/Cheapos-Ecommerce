const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const path = require('path');

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AdmdAr7vYaUya41PNQ1TyRtdjrULVT0zikssVbfHl4qBsvd_GF4hv6DFB_rmeFkRI1ea-2RKI40FOI2N',
    'client_secret': 'EMKuHgbFR27vII2yNyF1kbsLB_a9p5MhzZfQmzRCDPNzLg6YIXGu4kcrgW3JX1syOXFHGU-OcqQM1hZ6'
  });

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Bose QuietComfort 35 Wireless Headphones",
                    "sku": "001",
                    "price": "288.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "288.00"
            },
            "description": "Bose QuietComfort. The best headphones money can buy."
        }] 
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i< payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href)
                }
            }
        }
    });
    
});

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "288.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });

});

app.get('/cancel', (req, res) => res.send('Cancelled'));


app.listen(3000, () => console.log('Server Started'));