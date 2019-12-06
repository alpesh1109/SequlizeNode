module.exports = function(app) {
    
    const products = require('../controller/product.controller.js');
    // Create a new Customer
    app.post('/api/products',products.tblcreate );
 
}