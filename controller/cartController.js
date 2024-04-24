const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const Coupon = require("../models/couponSchema");
const objectId = require("mongoose").Types.ObjectId;




const getCartPage = async (req, res) => {
  try {
      const userId = req.session.userId;
      const cartData = await Cart.findOne({ userId: userId});
      const prodData = [];

      if (cartData) {
          const arr = cartData.items.map(item => item.productId);
          for (const productId of arr) {
              prodData.push(await Product.findById(productId));
          }
      }
      // console.log(prodData)
      console.log("3  "+cartData)

      res.render("user/cart", { prodData, cartData , userId}); // Pass itemId to the template
  } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
  }
};

    
// const addToCart = async (req, res) => {
//   console.log("add to cart is running")
//   const { prodQuantity, productId } = req.body;
//   try {
//       const userId = req.session.userId;
//       console.log("user Id " + userId);
//       const proData = await Product.findById(productId);
//       console.log("proData " + proData);
//       if (!proData) {
//           return res.json({ status: "error", message: "Product not found" });
//       } else {
//           let cart = await Cart.findOne({ userId: userId });
//           if (!cart) {
//               console.log("cart illaa...new cart adding ");
//               const cartData = new Cart({
//                   userId: userId,
//                   items: [{
//                       productId: proData._id,
//                       quantity: prodQuantity,
//                       subTotal: prodQuantity * proData.salePrice
//                   }],
//                   totalPrice: prodQuantity * proData.salePrice
//               });
//               cart = await cartData.save();
//               return res.json({ status: "success", cart });
//           }
//               console.log("else condition cart indengil...")
//               let proIndex = -1;
//               for (let i = 0; i < cart.items.length; i++) {
//                   if (proData._id.toString() == cart.items[i].productId) {
//                       proIndex = i;
//                       break;
//                   }    
//               }
//               if (proIndex !== -1) {
//                   console.log("Product already exists in the cart");
//                   const updatedQuantity = cart.items[proIndex].quantity + prodQuantity;
//                   cart.items[proIndex].quantity = updatedQuantity;
//                   cart.items[proIndex].subTotal = updatedQuantity * proData.salePrice;
                 
//                   cart = await Cart.findOne({ userId: userId }); 
//                   await cart.save();
//                   res.json({ status: "alreadyInCart" });
//               }else{     
//                   console.log("Product not found in the cart, adding it...");
                 
//                   cart.items.push({
//                       productId: proData._id,
//                       quantity: prodQuantity,
//                       subTotal: prodQuantity * proData.salePrice
//                   });
//               }
//               cart.totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
//               await cart.save();
//               console.log("Cart saved: ", cart);
//               res.json({ status: "success", message: "Product added to cart successfully", cart });
//           }
      
//   } catch (error) {
//       console.error("Error adding product to cart:", error);
//       res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };




//orij add to cart ..........................
const addToCart = async (req, res) => {
  const { prodQuantity, productId } = req.body;
  try {
      const userId = req.session.userId;
      const proData = await Product.findById(productId);
      if (!proData) {
          return res.json({ status: "error", message: "Product not found" });
      }
      const stock = proData.quantity;
      console.log(" stock...... "+stock);
      if(stock < prodQuantity){
        return res.json({ status: "outOfStock"});
      }


      let cart = await Cart.findOne({ userId: userId });
      if (!cart) {
          const cartData = new Cart({
              userId: userId,
              items: [{
                  productId: proData._id,
                  quantity: prodQuantity,
                  subTotal: prodQuantity * proData.salePrice
              }],
              totalPrice: prodQuantity * proData.salePrice
          });
          cart = await cartData.save();
          return res.json({ status: "success", message: "Product added to cart successfully", cart });
      }

      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
          return res.json({ status: "alreadyInCart", message: "Product already in cart" });
      }

      cart.items.push({
          productId: proData._id,
          quantity: prodQuantity,
          subTotal: prodQuantity * proData.salePrice
      });
      cart.totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
      await cart.save();
      return res.json({ status: "success", message: "Product added to cart successfully", cart });
  } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
  }
};







// //dupe dupe dupe dupe dupe
// const addToCart = async (req, res) => {
//   const { prodQuantity, productId } = req.body;
//   try {
//       const userId = req.session.userId;
//       const proData = await Product.findById(productId);
//       if (!proData) {
//           return res.json({ status: "error", message: "Product not found" });
//       }
//       const stock = proData.quantity;
//       console.log(" stock...... "+stock);
//       if(stock < prodQuantity){
//         return res.json({ status: "outOfStock"});
//       }


//       let cart = await Cart.findOne({ userId: userId });
//       if (!cart) {
//           const cartData = new Cart({
//               userId: userId,
//               items: [{
//                   productId: proData._id,
//                   quantity: prodQuantity,
//                   // subTotal: prodQuantity * proData.salePrice
//               }],
//               // totalPrice: prodQuantity * proData.salePrice
//           });
//           cart = await cartData.save();
//           // return res.json({ status: "success", message: "Product added to cart successfully", cart });
//       }

//       const existingItem = cart.items.find(item => item.productId.toString() === productId);
//       if (existingItem) {
//           return res.json({ status: "alreadyInCart", message: "Product already in cart" });
//       }

//       cart.items.push({
//           productId: proData._id,
//           quantity: prodQuantity,
//           // subTotal: prodQuantity * proData.salePrice
//       });
//       // cart.totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
//       await cart.save();
//       return res.json({ status: "success", message: "Product added to cart successfully", cart });
//   } catch (error) {
//       console.error("Error adding product to cart:", error);
//       res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };



const increment = async (req, res) => {
  try {
    const { price, prodId, subtotal, qty } = req.body;
    const quantity = parseInt(qty);
    const proId = prodId.toString();
    const proData = await Product.findById({ _id: proId });
    const stock = proData.quantity;
    if (stock > quantity) {
      if (quantity < 10) {
        const addPrice = await Cart.findOneAndUpdate(
          { userId: req.session.userId, "items.productId": proId },
          {
            $inc: {
              "items.$.quantity": 1,
              "items.$.subTotal": proData.salePrice,
              totalPrice: proData.salePrice,
            },
          }
        );
        const findCart = await Cart.findOne({ userId: req.session.userId });
        res.json({ status: true, total: findCart.totalPrice });
      } else {
        res.json({ status: "minimum" });
      }
    } else {
      res.json({ status: "stock" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



const decrement = async (req, res) => {
  try {
    const { price, prodId, subtotal, qty } = req.body;
    const quantity = parseInt(qty);
    const proId = prodId.toString();
    const proData = await Product.findById({ _id: proId });
    const stock = proData.quantity;
    if (quantity > 1) {
      const addPrice = await Cart.findOneAndUpdate(
        { userId: req.session.userId, "items.productId": proId },
        {
          $inc: {
            "items.$.quantity": -1,
            "items.$.subTotal": -proData.salePrice,
            totalPrice: -proData.salePrice,
          },
        }
      );
      const findCart = await Cart.findOne({ userId: req.session.userId });
      res.json({ status: true, total: findCart.totalPrice });
    } else {
      res.json({ status: "minimum" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



const deleteCartItem = async (req, res) => {
  const userId = req.session.userId;
  const id = req.query.id;
  const proData = await Product.findById(id);
  console.log(proData);
  console.log("idddddddd  " + id);
  // const { id } = req.query;
  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    const cartUpdate = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          items: { productId: id },
        },
        $inc: { totalPrice: -proData.salePrice }, // Decrement the totalPrice
      }
    );
    console.log(cartUpdate);
    await cart.save();
    if (cartUpdate) {
      res.json({ status: true, cartUpdate });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};



const CartTotalPrice = async (req, res) => {
  const userId = req.session.userId;
  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.json({ status: false });
    }
    return res.json({ status: true, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error("Error fetching total price of cart:", error);
    res.json({ status: false });
  }
};



//ivde ...you have to either make the total price calculation by refeence or make the total price to reduce ehile clearing cart
const clearCart = async (req, res) => {
  try {
    const { cartId } = req.query;
    console.log(cartId);
    const userId = req.session.userId;
    const cart = await Cart.findOne({ _id: cartId });
    if (cart.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    const productIds = cart.items.map((item) => item.productId);
    console.log(cart, productIds);
    const updateCart = await Cart.findOneAndUpdate(
      { _id: cartId },
      { $pull: { items: { productId: { $in: productIds } } } },
      { new: true } // To return the updated cart after removing the product
    );
    if (updateCart) {
      res.redirect("/productCart");
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({ error: "Failed to clear cart" });
  }
};



module.exports = {
  getCartPage,
  addToCart,
  increment,
  decrement,
  deleteCartItem,
  CartTotalPrice,
  clearCart,
};
