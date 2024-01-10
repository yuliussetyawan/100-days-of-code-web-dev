const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrder(req,res){
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders
    })
  } catch(error){
    next(error)
  }
 
}

async function addOrder(req, res) {
  const cart = res.locals.cart;
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }
  const order = new Order(cart, userDocument);

  try {
    order.save();
  } catch (error) {
    next(error);
    return;
  }
  // reset the cart session
  req.session.cart = null;
  res.redirect('/orders');
}


module.exports = { addOrder: addOrder, getOrder: getOrder };
