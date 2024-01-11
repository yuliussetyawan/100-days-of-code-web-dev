const stripe = require("stripe")(
  "sk_test_51OXKiJGB6ZM6bIxubNrEpiuTj5T9B3MYROw1TYflfpVILXC48WZyyjD0BpKTdPbfhKDo8x1V2TOkNpGsDG8RdLy500siO9xhVu"
);

const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrder(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cart.items.map(function(item) {
      return  {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title
          },
          // expressed in cents
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

module.exports = { addOrder: addOrder, getOrder: getOrder, getSuccess:getSuccess, getFailure: getFailure };
