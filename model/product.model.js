module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
      pname: {
          type: Sequelize.STRING
      },
      ptype: {
          type: Sequelize.STRING
      }
    });
    
    return Product;
  }