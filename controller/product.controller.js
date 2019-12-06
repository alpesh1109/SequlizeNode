const db = require('../config/db.config');
const products = db.products;
 
// Post a Customer
exports.tblcreate = (req, res) => {  
  // Save to MySQL database
  products.create({  
    pname: req.body.proname,
    ptype: req.body.protype
  }).then(products => {    
    // Send created customer to client
    res.send(products);
  });
};