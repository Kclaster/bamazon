const mysql = require('mysql');
var inquirer = require('inquirer');

var questions = [
  {
    type: 'input',
    name: 'productID',
    message: 'What is the id of the product you would like to purchase?'
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'How many would you like to purchase?'
  }
];

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Elijah@2018',
  database: 'bamazon'
});

connection.connect();
connection.query('SELECT * FROM products', function(error, results, fields) {
  if (error) throw error;
  for (let result of results) {
    console.log(
      `{Item Id: ${result.item_id}, Name: ${result.product_name}, Price: ${
        result.price
      }}`
    );
  }
  purchase();
});

var purchase = () => {
  inquirer.prompt(questions).then(answers => {
    let id = answers.productID;
    let number = answers.quantity;
    connection.query(`SELECT * from products WHERE item_ID = ${id}`, function(
      error,
      results
    ) {
      if (error) throw error;
      if (results.length === 0) {
        console.log("ID doesn't exist");
      } else if (number > results[0].stock_quantity) {
        console.log('Insufficient quantity!');
      } else {
        let newQuantity = results[0].stock_quantity - number;
        let cost = number * results[0].price;
        connection.query(
          `UPDATE products SET stock_quantity = ${newQuantity} WHERE item_ID = ${id}`,
          function(error, results) {
            console.log(
              `Order Placed! Charge to your account will be $${cost}. `
            );
            connection.end();
          }
        );
      }
    });
  });
};
