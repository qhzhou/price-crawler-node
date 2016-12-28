'use strict';

var Webpage = require('webpage');
var system = require('system');
var fs = require('fs');

function crawl(json) {
    console.log("crawling " + json.url);
    var page = Webpage.create();
    var postRequest = Webpage.create();
    page.open(json.url, function (status) {
        if (status !== 'success') {
            console.log('Unable to access network, status:' + status);
        } else {
            var category = "";
            setTimeout(function () {
                category = page.evaluate(function (skuIndex) {
                    document.getElementsByClassName("sku-item")[skuIndex].click();
                    return document.getElementsByClassName(
                        "sku-item")[skuIndex].getElementsByTagName(
                        'span')[0].innerHTML;
                }, json.skuIndex)
            }, 10000);
            setTimeout(function () {
                var price = page.evaluate(function () {
                    return document.getElementsByClassName("detail-price")[0].innerHTML;
                });
                var data = {
                    company: json.company,
                    url: json.url,
                    price: parseFloat(price),
                    category: category.trim(),
                    secret: "secret",
                    sku: json.sku
                };
                var settings = {
                    operation: "POST",
                    encoding: "utf8",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(data)
                };
                console.log(JSON.stringify(data));
                postRequest.open("http://localhost:8080/v1/api/priceRecords", settings,
                                 function () {
                                     phantom.exit();
                                 })
            }, 12000)
        }
    });
}

if (system.args.length === 2) {
    var idx = parseInt(system.args[1]);
    var input = JSON.parse(fs.read('input.json'));
    crawl(input[idx]);
} else {
    console.log('invalid params');
    phantom.exit();
}


