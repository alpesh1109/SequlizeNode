'use strict';
var path = require('path');
var express = require('express');
var app = express();
var mssql = require('mssql');
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var MyStaticEmailClass = require("./public/Logic/Mail");


var cache = require('memory-cache');
let memCache = new cache.Cache();
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cacheContent = memCache.get(key);
        if (cacheContent) {
            res.send(cacheContent);

        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                memCache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}


var config = {
    user: "sqluser",
    password: "usersql",
    database: "Jhonea",

    server: "192.68.100.153\\SQLEXPRESS",
    options:
    {
        trustedConnection: true,
        connectTimeout: 1000000,
        requestTimeout: 1000000,
        textsize: '2147483647',
        cancelTimeout: 5000,
        packetSize: 4096,
        //  port: 1433
    },
    port: 1433
};
var virtualDirPath = process.env.virtualDirPath || '';
const routes = {
    products: {
        get: virtualDirPath + '/api/products'
    },

    category: {
        get: virtualDirPath + '/api/category'
    },
    productdetails: {
        get: virtualDirPath + '/api/productdetails'
    },
    productcat: {
        get: virtualDirPath + '/api/productcat'
    },
    productdetailsbyid: {
        get: virtualDirPath + '/api/productdetailsbyid'
    },
    subcategory: {
        get: virtualDirPath + '/api/subcategory'
    },
    materiallist: {
        get: virtualDirPath + '/api/materiallist'
    },
    colorlist: {
        get: virtualDirPath + '/api/colorlist'
    },
    relatedimages: {
        get: virtualDirPath + '/api/relatedimages'
    },
    addreview: {
        post: virtualDirPath + '/api/addreview'
    },
    getcartdata: {
        get: virtualDirPath + '/api/getcartdata'
    },
    removecartdata: {
        post: virtualDirPath + '/api/removecartdata'
    },
    addtocart: {
        post: virtualDirPath + '/api/addtocart'
    },
    quantityprice: {
        post: virtualDirPath + '/api/quantityprice'
    },
    getwishdata: {
        post: virtualDirPath + '/api/getwishdata'
    },
    removewishproduct: {
        post: virtualDirPath + '/api/removewishproduct'
    },
    addtowishlist: {
        post: virtualDirPath + '/api/addtowishlist'
    },
    getaddressbyid: {
        post: virtualDirPath + '/api/getaddressbyid'
    },
    removeaddress: {
        post: virtualDirPath + '/api/removeaddress'
    },
    addtoorder: {
        post: virtualDirPath + '/api/addtoorder'
    },
    addorderdetails: {
        post: virtualDirPath + '/api/addorderdetails'
    },
    addaddressdata: {
        post: virtualDirPath + '/api/addaddressdata'
    },
    getorderdata: {
        post: virtualDirPath + '/api/getorderdata'
    },
    getorderdetails: {
        post: virtualDirPath + '/api/getorderdetails'
    },
    getproductdetails: {
        post: virtualDirPath + '/api/getproductdetails'
    },
    searchproduct: {
        get: virtualDirPath + '/api/searchproduct'
    },
    logindata: {
        post: virtualDirPath + '/api/logindata'
    },
    otpverify: {
        post: virtualDirPath + '/api/otpverify'
    },
    resendotp: {
        post: virtualDirPath + '/api/resendotp'
    },
    adduserdata: {
        post: virtualDirPath + '/api/adduserdata'
    },
    profiledata: {
        get: virtualDirPath + '/api/profiledata'
    },
    updateuserdata: {
        post: virtualDirPath + '/api/updateuserdata'
    },
    getbillingadd: {
        post: virtualDirPath + '/api/getbillingadd'
    },
    relateddata: {
        get: virtualDirPath + '/api/relateddata'
    },
    getcountrydata: {
        get: virtualDirPath + '/api/getcountrydata'
    },
    getstatedata: {
        get: virtualDirPath + '/api/getstatedata'
    },
    getcitydata: {
        get: virtualDirPath + '/api/getcitydata'
    },
    addfeedback: {
        post: virtualDirPath + '/api/addfeedback'
    },
    getcoupondata: {
        get: virtualDirPath + '/api/getcoupondata'
    },
    getdiscount: {
        post: virtualDirPath + '/api/getdiscount'
    },
    fetchguestcartdata: {
        post: virtualDirPath + '/api/fetchguestcartdata'
    },
    removeguestcartdata: {
        post: virtualDirPath + '/api/removeguestcartdata'
    },
    CancelOrderProduct: {
        post: virtualDirPath + '/api/CancelOrderProduct'
    },
    updateuserprofiledata: {
        post: virtualDirPath + '/api/updateuserprofiledata'
    },
    getreviewlist: {
        post: virtualDirPath + '/api/getreviewlist'
    }
}

//app.use(responseTime());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 3000);

app.use(express.static("public"));

app.get(routes.products.get, cacheMiddleware(10), function (req, res) {

    
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.execute('GetProduct').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.productdetails.get, cacheMiddleware(10), function (req, res) {

    try {
        var id = req.query.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('pId', mssql.NVarChar, id);
            _sqlRequest.execute('GetProduct').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.productdetailsbyid.get, cacheMiddleware(10), function (req, res) {

    try {
        var id = req.query.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('pId', mssql.NVarChar, id);
            _sqlRequest.execute('GetProduct').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.productcat.get, cacheMiddleware(10), function (req, res) {

    try {
        var id = req.query.id;
        //var pageNo = req.query.pageNo;
        //var pageSize = req.query.pageSize;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('pcatId', mssql.NVarChar, id);
            //_sqlRequest.input('pageNo', mssql.NVarChar, pageNo);
            //_sqlRequest.input('pageSize', mssql.NVarChar, pageSize);
            _sqlRequest.execute('GetProductByCategory').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.category.get, cacheMiddleware(10), function (req, res) {

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.execute('GetCategory').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.subcategory.get, cacheMiddleware(10), function (req, res) {

    try {
        let id = req.query.id;
        let search = req.query.search;
        let pageNo = req.query.pageNo;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('catId', mssql.NVarChar, id);
            _sqlRequest.input('search', mssql.NVarChar, search);
            _sqlRequest.input('pageNo', mssql.NVarChar, pageNo);
            _sqlRequest.execute('GetSubCategoryList').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }

});

app.get(routes.materiallist.get, cacheMiddleware(10), function (req, res) {
    try {
        var id = req.query.id;
        let search = req.query.search;
        let pageNo = req.query.pageNo;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('catId', mssql.NVarChar, id);
            _sqlRequest.input('search', mssql.NVarChar, search);
            _sqlRequest.input('pageNo', mssql.NVarChar, pageNo);
            _sqlRequest.execute('GetMaterialList').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });
    } catch (e) {
        res.json(e);
    }

});

app.get(routes.colorlist.get, cacheMiddleware(10), function (req, res) {
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.execute('GetColorList').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });
    } catch (e) {
        res.json(e);
    }

});

app.get(routes.relatedimages.get, cacheMiddleware(10), function (req, res) {

    try {
        var id = req.query.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('pId', mssql.NVarChar, id);
            _sqlRequest.execute('GetRelatedImages').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.addreview.post, function (req, res) {

    try {
        var name = req.body.name;
        var email = req.body.email;
        var desc = req.body.desc;
        var id = req.body.id;
        var userId = req.body.userId;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('reviewname', mssql.NVarChar, name);
            _sqlRequest.input('reviewemail', mssql.NVarChar, email);
            _sqlRequest.input('reviewdesc', mssql.NVarChar, desc);
            _sqlRequest.input('reviewid', mssql.NVarChar, id);
            _sqlRequest.input('reviewuserid', mssql.NVarChar, userId);
            _sqlRequest.execute('InsertReviewData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.getcartdata.get, function (req, res) {
    try {
        var data = req.query.userid;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('cartUserId', mssql.NVarChar, data);
            _sqlRequest.execute('SpGetCartData').then(function (recordsets) {

                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.removecartdata.post, function (req, res) {
    let param = req.body;

    var data = {
        cartId: param.cartId,
        //cartProId: param.cartProId,
        cartuserid: param.userid
    };
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('cartUserId', mssql.NVarChar, data.cartuserid);
            //_sqlRequest.input('cartProId', mssql.NVarChar, data.cartProId);
            _sqlRequest.input('cartId', mssql.NVarChar, data.cartId);
            _sqlRequest.execute('SpDeleteProduct').then(function (recordsets) {

                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
})

app.post(routes.removeguestcartdata.post, function (req, res) {
    let param = req.body;

    var data = {
        cartId: param.cartId,
        cartUuId: param.uuid
    };
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('cartUuId', mssql.NVarChar, data.cartUuId);
            _sqlRequest.input('cartId', mssql.NVarChar, data.cartId);

            _sqlRequest.execute('SpDeleteGuestCartData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
})

app.post(routes.addtocart.post, function (req, res) {

    let param = req.body;
    var data = {

        cartUserId: param.cartdata.cartUserId,
        cartProId: param.cartdata.cartProId,
        cartName: param.cartdata.cartName,
        cartImage: param.cartdata.cartImage,
        cartQuantity: param.cartdata.cartQuantity,
        cartProductPrice: param.cartdata.cartProductPrice,
        cartTotalPrice: param.cartdata.cartTotalPrice,
        cartcatId: param.cartdata.cartcatId,
        cartUuId: param.cartdata.cartUuId
    };
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            if (data.cartUserId === null) {

                _sqlRequest.input('cartUserId', mssql.NVarChar, data.cartUserId);
                _sqlRequest.input('cartProId', mssql.NVarChar, data.cartProId);
                _sqlRequest.input('cartName', mssql.NVarChar, data.cartName);
                _sqlRequest.input('cartImage', mssql.NVarChar, data.cartImage);
                _sqlRequest.input('cartQuantity', mssql.NVarChar, data.cartQuantity);
                _sqlRequest.input('cartProductPrice', mssql.NVarChar, data.cartProductPrice);
                _sqlRequest.input('cartTotalPrice', mssql.NVarChar, data.cartTotalPrice);
                _sqlRequest.input('cartcatId', mssql.NVarChar, data.cartcatId);
                _sqlRequest.input('cartUuId', mssql.NVarChar, data.cartUuId);

                _sqlRequest.execute('SpInsertGuestCartData').then(function (recordsets) {
                    res.json(recordsets.recordsets[0]);
                });

            } else {
                _sqlRequest.input('cartUserId', mssql.NVarChar, data.cartUserId);
                _sqlRequest.input('cartProId', mssql.NVarChar, data.cartProId);
                _sqlRequest.input('cartName', mssql.NVarChar, data.cartName);
                _sqlRequest.input('cartImage', mssql.NVarChar, data.cartImage);
                _sqlRequest.input('cartQuantity', mssql.NVarChar, data.cartQuantity);
                _sqlRequest.input('cartProductPrice', mssql.NVarChar, data.cartProductPrice);
                _sqlRequest.input('cartTotalPrice', mssql.NVarChar, data.cartTotalPrice);
                _sqlRequest.input('cartcatId', mssql.NVarChar, data.cartcatId);
                _sqlRequest.input('cartUuId', mssql.NVarChar, data.cartUuId);

                _sqlRequest.execute('SpInsertCartData').then(function (recordsets) {
                    res.json(recordsets.recordsets[0]);
                });
            }


        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.quantityprice.post, function (req, res) {
    let param = req.body;
    var data = {

        cartProId: param.cartProId,
        cartQuantity: param.quantity,
        cartTotalPrice: param.cartTotalPrice

    };
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('cartProId', mssql.NVarChar, data.cartProId);
            _sqlRequest.input('cartQuantity', mssql.NVarChar, data.cartQuantity);
            _sqlRequest.input('cartTotalPrice', mssql.NVarChar, data.cartTotalPrice);
            _sqlRequest.execute('SpQuantityPriceCounter').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getwishdata.post, function (req, res) {
    let param = req.body;
    var data = {
        userId: param.userid
    };
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('wishUserId', mssql.NVarChar, data.userId);
            _sqlRequest.execute('SpGetWishData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.removewishproduct.post, function (req, res) {
    let param = req.body;
    var data = {
        wishUserId: param.userid,
        wishProId: param.wishProId

    };

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('wishUserId', mssql.NVarChar, data.wishUserId);
            _sqlRequest.input('wishProId', mssql.NVarChar, data.wishProId);
            _sqlRequest.execute('SpDeleteWish').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.addtowishlist.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('wishUserId', mssql.NVarChar, param.userid);
            _sqlRequest.input('wishProId', mssql.NVarChar, param.product.id);
            _sqlRequest.input('wishName', mssql.NVarChar, param.product.name);
            _sqlRequest.input('wishImage', mssql.NVarChar, param.product.image);
            _sqlRequest.input('wishPcs', mssql.NVarChar, param.product.pcs);
            _sqlRequest.input('wishProductPrice', mssql.NVarChar, param.product.price);
            _sqlRequest.input('wishQuantity', mssql.NVarChar, 1);
            _sqlRequest.input('wishDiscription', mssql.NVarChar, param.product.description);
            _sqlRequest.input('wishcatId', mssql.NVarChar, param.product.catId)
            _sqlRequest.execute('SpInsertWishData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getaddressbyid.post, function (req, res) {
    let param = req.body;
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {

            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('loginUserId', mssql.NVarChar, param.id);
            _sqlRequest.execute('SpGetAddressData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.removeaddress.post, function (req, res) {
    let param = req.body;
    var data = {

        id: param.id

    };
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('addressId', mssql.NVarChar, data.id);
            _sqlRequest.execute('SpDeleteAddress').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.addtoorder.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('ordUserId', mssql.NVarChar, param.id);
            _sqlRequest.input('ordNumber', mssql.NVarChar, param.ordnumber);
            _sqlRequest.input('orderReqDate', mssql.NVarChar, param.date);
            _sqlRequest.input('ordDropAddressRefId', mssql.NVarChar, param.addrefid);
            _sqlRequest.input('ordStatus', mssql.NVarChar, param.ordstatus);
            _sqlRequest.input('ordDeliveryDate', mssql.NVarChar, param.orddelidate);
            _sqlRequest.input('ordDispatechDate', mssql.NVarChar, param.orddispatchdate);
            _sqlRequest.input('ordConfirmDate', mssql.NVarChar, param.ordConfirmDate);
            _sqlRequest.input('ordPackedDate', mssql.NVarChar, param.ordPackedDate);
            _sqlRequest.input('ordTotalItem', mssql.NVarChar, param.ordTotalItem);
            _sqlRequest.input('ordDiscount', mssql.NVarChar, param.ordTotalAmount[0].discount);
            _sqlRequest.input('ordDeliveryCharge', mssql.NVarChar, param.ordTotalAmount[0].dliveryCharge);
            _sqlRequest.input('ordTax', mssql.NVarChar, param.ordTotalAmount[0].tax);
            _sqlRequest.input('ordTotalAmount', mssql.NVarChar, param.ordTotalAmount[0].total);
            _sqlRequest.input('ordTotalPay', mssql.NVarChar, param.ordTotalAmount[0].totalpay);

            _sqlRequest.execute('SpInserOrder').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.addorderdetails.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('ordId', mssql.NVarChar, param.data[0].ordId);
            _sqlRequest.input('ordUserId', mssql.NVarChar, param.cart.cartUserId);
            _sqlRequest.input('ordProId', mssql.NVarChar, param.cart.cartProId);
            _sqlRequest.input('ordAddressRefId', mssql.NVarChar, param.data[0].ordDropAddressRefId);
            _sqlRequest.input('ordProName', mssql.NVarChar, param.cart.cartName);
            _sqlRequest.input('ordProImage', mssql.NVarChar, param.cart.cartImage);
            _sqlRequest.input('ordProQuantity', mssql.NVarChar, param.cart.cartQuantity);
            _sqlRequest.input('ordProPrice', mssql.NVarChar, param.cart.cartProductPrice);
            _sqlRequest.input('ordReqDate', mssql.NVarChar, param.data[0].orderReqDate);
            _sqlRequest.input('ordDetailDeliveryDate', mssql.NVarChar, "");
            _sqlRequest.input('ordDispatchDate', mssql.NVarChar, "");
            _sqlRequest.input('ordDetailStatus', mssql.NVarChar, param.data[0].ordStatus);
            _sqlRequest.input('ordDetailConfirmDate', mssql.NVarChar, "");
            _sqlRequest.input('ordDetailPackDate', mssql.NVarChar, "");
            _sqlRequest.input('orderNotes', mssql.NVarChar, param.note);

            _sqlRequest.execute('SpInserOrderDetails').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.addaddressdata.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {

            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('loginUserId', mssql.NVarChar, param[0].loginUserId);
            _sqlRequest.input('ordAddRefId', mssql.NVarChar, param[1].ordAddRefId);
            _sqlRequest.input('firstName', mssql.NVarChar, param[2].firstName);
            _sqlRequest.input('lastName', mssql.NVarChar, param[3].lastName);
            _sqlRequest.input('country', mssql.NVarChar, param[4].country);
            _sqlRequest.input('streetAddress', mssql.NVarChar, param[5].streetAddress);
            _sqlRequest.input('titleOfAddress', mssql.NVarChar, param[6].titleOfAddress);
            _sqlRequest.input('city', mssql.NVarChar, param[7].city);
            _sqlRequest.input('state', mssql.NVarChar, param[8].state);
            _sqlRequest.input('zipCode', mssql.NVarChar, param[9].zipCode);
            _sqlRequest.input('mobile', mssql.NVarChar, param[10].mobile);
            _sqlRequest.input('email', mssql.NVarChar, param[11].email);
            _sqlRequest.input('panno', mssql.NVarChar, '');
            _sqlRequest.input('gstno', mssql.NVarChar, '');
            _sqlRequest.input('companyname', mssql.NVarChar, '');

            _sqlRequest.execute('SpInsertAddress').then(function (recordsets) {

                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getorderdata.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('ordUserId', mssql.NVarChar, param.userid);

            _sqlRequest.execute('SpGetOrder').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getorderdetails.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('ordUserId', mssql.NVarChar, param.userid);

            _sqlRequest.execute('SpGetOrderDetails').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getproductdetails.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('ordProId', mssql.NVarChar, param.proid);
            _sqlRequest.input('ordAddressRefId', mssql.NVarChar, param.addrefid);
            _sqlRequest.input('ordUserId', mssql.NVarChar, param.userid);
            _sqlRequest.input('orderId', mssql.NVarChar, param.orderid);
            _sqlRequest.execute('SpGetProductDetails').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.get(routes.searchproduct.get, function (req, res) {

    try {
        var search = req.query.search;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('search', mssql.NVarChar, search);
            _sqlRequest.input('pageNo', mssql.NVarChar, 1);
            _sqlRequest.input('pageSize', mssql.NVarChar, 6);
            _sqlRequest.execute('GetProductByCategory').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.logindata.post, function (req, res) {

    let param = req.body;
    try {

        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userCountry', mssql.NVarChar, param.userCountry);
            _sqlRequest.input('userMobileNum', mssql.NVarChar, param.userMobileNum);
            _sqlRequest.input('userOTP', mssql.NVarChar, param.userOTP);
            _sqlRequest.execute('SpLogIn').then(function (recordsets) {

                var data = recordsets.recordset;

                var mail = data[0].userEmail;
                var userOTP = data[0].userOTP;
                MyStaticEmailClass.SentMail(mail, userOTP);

                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.otpverify.post, function (req, res) {

    let param = req.body;
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userMobileNum', mssql.NVarChar, param.userMobileNum);
            _sqlRequest.input('userOTP', mssql.NVarChar, param.userOTP);
            _sqlRequest.input('uuid', mssql.NVarChar, param.uuid);
            _sqlRequest.input('uId', mssql.NVarChar, param.uId);

            _sqlRequest.execute('SpVerifyOTP').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.resendotp.post, function (req, res) {

    let param = req.body;
    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userCountry', mssql.NVarChar, param.userCountry);
            _sqlRequest.input('userMobileNum', mssql.NVarChar, param.userMobileNum);
            _sqlRequest.input('userOTP', mssql.NVarChar, param.userOTP);
            _sqlRequest.execute('SpLogIn').then(function (recordsets) {
                var data = recordsets.recordset;
                var mail = data[0].userEmail;
                var userOTP = data[0].userOTP;
                MyStaticEmailClass.SentMail(mail, userOTP);
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.adduserdata.post, function (req, res) {

    let param = req.body;
    try {

        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userName', mssql.NVarChar, param[0].userName);
            _sqlRequest.input('userCountry', mssql.NVarChar, param[1].userCountry);
            _sqlRequest.input('userMobileNum', mssql.NVarChar, param[2].userMobileNum);
            _sqlRequest.input('userEmail', mssql.NVarChar, param[3].userEmail);
            _sqlRequest.input('userMobileCode', mssql.NVarChar, "+91");
            _sqlRequest.input('userOTP', mssql.NVarChar, "");
            _sqlRequest.input('userAlternateNo', mssql.NVarChar, "");

            _sqlRequest.execute('SpInsertUser').then(function (recordsets) {

                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.profiledata.get, function (req, res) {

    try {
        var userId = req.query.userId;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userId', mssql.NVarChar, userId);
            _sqlRequest.execute('GetUserProfileData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.updateuserdata.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {

            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userName', mssql.NVarChar, param[0].userName);
            _sqlRequest.input('userEmail', mssql.NVarChar, param[1].userEmail);
            _sqlRequest.input('userMobileNum', mssql.NVarChar, param[2].userMobileNum);
            _sqlRequest.input('userAlternateNo', mssql.NVarChar, param[3].userAlternateNo);
            _sqlRequest.input('userCompanyName', mssql.NVarChar, param[4].CompanyName);
            _sqlRequest.input('userGSTNo', mssql.NVarChar, param[5].GSTNo);
            _sqlRequest.input('userPANNo', mssql.NVarChar, param[6].PANNo);
            _sqlRequest.input('userTitleAdd', mssql.NVarChar, param[7].titleOfAddress);
            _sqlRequest.input('userCountry', mssql.NVarChar, param[8].country);
            _sqlRequest.input('userFullAdd', mssql.NVarChar, param[9].streetAddress);
            _sqlRequest.input('userCity', mssql.NVarChar, param[10].city);
            _sqlRequest.input('userState', mssql.NVarChar, param[11].state);
            _sqlRequest.input('userPinCode', mssql.NVarChar, param[12].zipCode);
            _sqlRequest.input('userId', mssql.NVarChar, param[13].userid);
            _sqlRequest.input('useraddId', mssql.NVarChar, param[14].addressId);

            _sqlRequest.execute('UpdateUserData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.updateuserprofiledata.post, function (req, res) {
    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {

            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userName', mssql.NVarChar, param[0].userName);
            _sqlRequest.input('userEmail', mssql.NVarChar, param[1].userEmail);
            _sqlRequest.input('userMobileNum', mssql.NVarChar, param[2].userMobileNum);
            _sqlRequest.input('userAlternateNo', mssql.NVarChar, param[3].userAlternateNo);
            _sqlRequest.input('userId', mssql.NVarChar, param[4].userid);

            _sqlRequest.execute('UpdateUserProfileData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getbillingadd.post, function (req, res) {

    try {
        var userId = req.body.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('userId', mssql.NVarChar, userId);
            _sqlRequest.execute('GetBillingDetails').then(function (recordsets) {

                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.relateddata.get, function (req, res) {

    try {
        var id = req.query.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('pcatId', mssql.NVarChar, id);
            _sqlRequest.execute('GetRelatedData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.getcountrydata.get, function (req, res) {

    try {

        var con = [];
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.execute('GetCountryData').then(function (recordsets) {

                recordsets.recordset.forEach(function (item) {
                    con.push({
                        "label": item.couName,
                        "value": item.couId
                    })
                });
                res.json(con);
                //res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.getstatedata.get, function (req, res) {

    try {

        var con = [];
        var id = req.query.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('statecouId', mssql.NVarChar, id);
            _sqlRequest.execute('GetStateData').then(function (recordsets) {

                recordsets.recordset.forEach(function (item) {
                    con.push({
                        "label": item.stateName,
                        "value": item.stateId
                    })
                });
                res.json(con);
                //res.json(recordsets.recordset);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.getcitydata.get, function (req, res) {

    try {

        var con = [];
        var sid = req.query.sid;
        var cid = req.query.cid;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('stateId', mssql.NVarChar, sid);
            _sqlRequest.input('couId', mssql.NVarChar, cid);
            _sqlRequest.execute('GetCityData').then(function (recordsets) {

                recordsets.recordset.forEach(function (item) {
                    con.push({
                        "label": item.ciyName,
                        "value": item.ciyId
                    })
                });
                res.json(con);
                //res.json(recordsets.recordset);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

app.get(routes.getcoupondata.get, function (req, res) {

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.execute('SpGetCouponCodeList').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.addfeedback.post, function (req, res) {

    try {

        var desc = req.body.desc;
        var userid = req.body.userid;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('feedbackdesc', mssql.NVarChar, desc);
            _sqlRequest.input('feedbackuserid', mssql.NVarChar, userid);
            _sqlRequest.execute('InsertFeedbackData').then(function (recordsets) {

                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.fetchguestcartdata.post, function (req, res) {

    try {
        let data = req.body;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);

            _sqlRequest.input('cartUuId', mssql.NVarChar, data.uuid);
            _sqlRequest.execute('SpGuestCartData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.get(routes.getcoupondata.get, function (req, res) {

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.execute('SpGetCouponCodeList').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.getdiscount.post, function (req, res) {

    let param = req.body;

    try {
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('couponcode', mssql.NVarChar, param.couponcode);
            _sqlRequest.execute('SpGetDiscount').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });
        });

    } catch (e) {
        res.json(e);
    }
});

app.post(routes.CancelOrderProduct.post, function (req, res) {

    let param = req.body;
    var data = {
        ordId: param.ordId,
        ordUserId: param.userid
    };
    try {
        var conn = new mssql.ConnectionPool(config);

        conn.connect().then(function () {
            var request = new mssql.Request(conn);
            request.input('ordUserId', mssql.NVarChar, data.ordUserId);
            request.input('ordId', mssql.NVarChar, data.ordId);
            request.execute('SpCancelOrder').then(function (recordsets) {
                //console.log(recordsets.recordset);
                res.redirect('/');

            });
        });
    }
    catch (e) {
        res.json(e);
    }

});

app.post(routes.getreviewlist.post, cacheMiddleware(10), function (req, res) {
    
    try {
        var id = req.body.id;
        var conn = new mssql.ConnectionPool(config);
        conn.connect().then(function () {
            var _sqlRequest = new mssql.Request(conn);
            _sqlRequest.input('revproId', mssql.NVarChar, id);
            _sqlRequest.execute('GetReviewData').then(function (recordsets) {
                res.json(recordsets.recordsets[0]);
            });

        });
    } catch (e) {
        res.json(e);
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        // res.render('404', { url: req.url });
        res.sendFile(path.join(__dirname + '/public/index.html'));
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
var server = app.listen(app.get('port'), function () {
    console.log(`[products] API execute port ${process.env.PORT}.`);
});
