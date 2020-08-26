/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

module.exports = (db) => {

  // Make function userExists(arg1, arg2)
  // runs a query checking for those values if they exist in users table
  const items = () => {
    const text = `
      SELECT name, price, picture_url, description, category
      FROM menu_items
      `;
    //const values = [email, phone];
    return db.query(text).then((result) => {
      if (result.rows !== undefined) {
        console.log("Result from query items", result.rows);
        if (result.rows) {
          return result.rows;
        }
      } else {
        return false;
      }
    });
  };


  router.get("/", (req,res) => {


    items().then ((items) =>    {

    if (!items) {
      //User already present
      res
        .status(403)
        let templateVars = {errMessage: "Sorry, the no items"};
        res.render("errors_msg", templateVars);
    } else {
      console.log('return from user function',items )
      for(let item in items) {
        console.log(items[item])
      }
      let templateVars = {items: items};
      res.render('index',templateVars);
    }

  })
  })



  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  let fromcartExample = [{item_name:"Lighthouse Americano",qty:2,price:3.55, category: '', options:{ size:"medium"}},
                        {item_name:"Lighthouse Americano",qty:2,price:3.55, category: '', options:{ size:"medium"}}]

  router.post("/", (req, res) => {
    console.log('---------------------------------')
    console.log("body", JSON.parse(req.body.cart))
    const mycart = JSON.parse(req.body.cart)
    console.log("MyCart", mycart )
    //try to combine all info in an object
    let myCheckoutArray = []
    let myCheckoutObject = {};
    let itemId = [];
    // console.log("body index 0", JSON.parse(req.body.cart[0]))
    console.log("body [0]", mycart[0])
    // console.log("type of", typeof req.body.cart[0].qty)
    // console.log("quantity", JSON.parse(req.body.cart[0].qty))
   // for (let i=0; i < mycart.length; i++) {
    //  console.log("Loop", mycart[i])
    //  itemName.push(mycart[i].item_name)


    //console.log("item name", itemName);
    //Question for mentor:
    //1)how to send more then one value to array values
    //2)how link option side
    // for (let name of itemName) {

    //query to get the price and item id by menu item name
    const text1 = `
    SELECT menu_items.id, menu_items.name, menu_items.price
    FROM menu_items
    JOIN order_items ON (order_items.menu_item_id = menu_items.id)
    JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
    WHERE menu_items.name = ANY($1)
	  GROUP BY menu_items.id`;
    const values1 = mycart.map(item => item.item_name);
    console.log("db.query1", db.query(text1, values1).toString())
    console.log("Value1", values1)
      return db.query(text1, [values1]).then((result) => {
        console.log("Result from query find item_id by item name", result.rows); //result.rows[0]
        //itemId.push(result.rows[0].id)


        //query to get the price modifier by size
        const text2 = `
          SELECT coffe_sizes.id, coffe_sizes.size, coffe_sizes.price_modifier
          FROM coffe_sizes
          WHERE coffe_sizes.size = ANY($1)
	        GROUP BY coffe_sizes.id`;
          const values2 = mycart.map(item => item.options.size);
          console.log("db.query2", db.query(text2, values2).toString())
          console.log("Value2", values2)
            return db.query(text2, [values2]).then((result2) => {
              console.log("Result from query find coffe_size_id by size name", result2.rows); //result.rows[0]
              //itemId.push(result.rows[0].id)


              //make calculation of price
              for (let i=0; i < mycart.length; i++) {
              // if (!result.rows[i]) {
              //   break
              // }
               let tempPrice = 0;
                console.log("FOR i: ", i)
                //give same id like in the cart
                console.log("mycart[i].id", mycart[i].id)
                myCheckoutObject.id = mycart[i].id
                //give same quantity like the cart
                console.log("mycart[i].qty", mycart[i].qty)
                myCheckoutObject.qty = parseInt(mycart[i].qty)
                console.log(" myCheckout[i].qty",  myCheckoutObject.qty)




                //check name to calculate price
                //result.row = [ anonymous { id: 1, name: 'Americano', price: 176 }, anonymous { id: 2, name: 'Cappuccino', price: 355 }, anonymous { id: 3, name: 'Espresso', price: 288 } ]
                for (let j=0; j < result.rows.length; j++) {
                  console.log(" mycart[i].item_name", mycart[i].item_name)
                  //console.log(" result.rows[j].name", result.rows[i].name)
                //   console.log(" result.rows[j].price", result.rows[j].price)
                    if (mycart[i].item_name === result.rows[j].name) {
                        myCheckoutObject.item_id = result.rows[j].id
                         myCheckoutObject.name = result.rows[j].name;
                        tempPrice = result.rows[j].price;
                        break

                   }
                 }

                //myCheckoutObject.name = mycart[i].item_name

                //   console.log("parse single price", parseInt(result.rows[i].price))
                // //console.log(parseInt(result.rows[i].price))
                Math.trunc(myCheckoutObject.price =  tempPrice * parseInt(mycart[i].qty))

                //by default the size is small
                myCheckoutObject.item_size_id = 1;
                // console.log("mycart[i].options.size", mycart[i].options.size)
                 if (mycart[i].options.size === 'medium') {
                  Math.trunc(myCheckoutObject.price = myCheckoutObject.price *1.30)
                  myCheckoutObject.item_size_id = 2;
                 }
                 if (mycart[i].options.size === 'large') {
                  Math.trunc(myCheckoutObject.price = myCheckoutObject.price * 1.60)
                  myCheckoutObject.item_size_id = 3;
                 }
                // //myCheckoutObject.price = Math.trunc(result.rows[i].price * result2.rows[i].price_modifier) * myCheckoutObject.qty
                // myCheckoutObject.price = Math.round(myCheckoutObject.price) / 100;
                myCheckoutArray.push(myCheckoutObject)
                myCheckoutObject = {}

              }

              console.log("This is myCheckout object: ",  myCheckoutObject);
              console.log("This is myCheckout array: ",  myCheckoutArray);

              //add order to orders table
//pending point:
//1) trunk price item above
//2) get current time now converted in format right for table :
//3) get the user_id that made the order to pass as value at the below query

              const text3 =
              "INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES($1, $2, $3, $4) RETURNING *";
              const values3 = [ 1, true, '2020-08-26T18:00:00.000Z', false];
              console.log("query insert order")
              return db.query(text3, values3).then((dbRes) => {
                console.log("dbRes", dbRes)

                let order_id = dbRes.rows[0].id
                //console.log("order_id dbRes[0].id", order_id)
                //add to order_items by FOR loop (advice by mentor)
                for (let i=0; i < myCheckoutArray.length; i++) {
                  const text4 =
                    "INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES($1, $2, $3, $4, $5) RETURNING *";
                  const values4 = [ order_id,  myCheckoutArray[i].item_id, myCheckoutArray[i].price, myCheckoutArray[i].item_size_id];
                  console.log("Just before query insert")
                  return db.query(text4, values4).then((dbRes) => {
                    console.log("dbRes", dbRes)

                })
                }
              })


            });
      });

    const text =
          "INSERT INTO order_items (menu_item_id, quantity, price, size_id) VALUES($1, $2, $3, $4) RETURNING *";
        const values = [ 1, parseInt(mycart[0].qty), parseInt(mycart[0].price * 100)];
        console.log("Just before query insert")
        db.query(text, values)
        .then((dbRes) => {
          console.log("dbRes", dbRes)
          res.redirect("/home");
          if (dbRes !== undefined) {
            //console.log("Return object from insert query", dbRes.rows[0].id);
            //set cookie
            //req.session.name = dbRes.rows[0].id;
            // console.log()

          } else {
            res.
            status(500)
            let templateVars = {errMessage: "Sorry, registration failed! Try it again."};
            res.render("errors_msg", templateVars);
          }
        })
        .catch((err) => {
          console.log("Something Broke !", err);
        });


  })


  return router;
};
