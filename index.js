'use strict';

var Webpage = require('webpage');
var system = require('system');

var input = [
    {
        company: "lazy cat",
        skuIndex: 0,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.23.vxpueT&id=41027834971&scm=20140635.1_1_5.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "lazy cat",
        skuIndex: 1,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.23.vxpueT&id=41027834971&scm=20140635.1_1_5.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "lazy cat",
        skuIndex: 2,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.23.vxpueT&id=41027834971&scm=20140635.1_1_5.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "rruu",
        skuIndex: 0,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.28.vxpueT&id=532640305672&scm=20140635.1_1_6.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "rruu",
        skuIndex: 1,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.28.vxpueT&id=532640305672&scm=20140635.1_1_6.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "rruu",
        skuIndex: 2,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.28.vxpueT&id=532640305672&scm=20140635.1_1_6.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "itrip",
        skuIndex: 0,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.33.vxpueT&id=527167821291&scm=20140635.1_1_7.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "itrip",
        skuIndex: 1,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.33.vxpueT&id=527167821291&scm=20140635.1_1_7.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "tours for fun",
        skuIndex: 0,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.43.vxpueT&id=521354623106&scm=20140635.1_1_9.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "tours for fun",
        skuIndex: 1,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.43.vxpueT&id=521354623106&scm=20140635.1_1_9.0_b.0a67c0bb14819650716067969e"
    },
    {
        company: "tours for fun",
        skuIndex: 2,
        url: "https://items.alitrip.com/item.htm?spm=181.7621407.a1z9b.43.vxpueT&id=521354623106&scm=20140635.1_1_9.0_b.0a67c0bb14819650716067969e"
    }
]

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
                    secret: "secret"
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
    crawl(input[idx]);
} else {
    console.log('invalid params');
    phantom.exit();
}


