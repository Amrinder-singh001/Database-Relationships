const mongoose = require("mongoose");
const {Schema} = require("mongoose");

main()
  .then(() => {
    console.log("Connected To DB👍");
  }) 
  .catch((err) => console.log("connection falied👎 ->" , err.message));

async function main() {
  await mongoose.connect(
  "mongodb+srv://amxindersingh_db_user:bsjMTpBpp5loIzZK@cluster0.rdlt2k9.mongodb.net/DatabaseRalationship?appName=Cluster"
  );
  console.log("Connected Database:", mongoose.connection.name);

  // 1. Get all databases
  const admin = mongoose.connection.db.admin();
  const dbsList = await admin.listDatabases();

  console.log("All Databases in Atlas Cluster:");
    dbsList.databases.forEach(db => {
    console.log(` - ${db.name}`);
  });
}







//schema is like a blueprint of the model. It defines the structure of the document, default values, validators, etc.
// created a schema for orders.
const orderSchema = new Schema({
    item : String,
    price : Number,
})

// created a schema for customers.
const customerSchema = new Schema({
    name : String,
    orders : [
        {
            type : Schema.Types.ObjectId,
            ref : "Order"
        }
    ]
})









// part of handling deletion (mongoose middleware) : specifically for the purpose of deleting the orders of a customer when the customer is deleted.
customerSchema.post("findOneAndDelete", async (customer) => {
    // const doc = await this.model.findOne(this.getQuery());
    if(customer.orders.length > 0){
        let result = await Order.deleteMany({
            _id : {
                $in : customer.orders
            }
        })
        console.log(result);
    }
})






// created a model for orderSchema.
const Order = mongoose.model("Order", orderSchema);
// created a model for customerSchema.
const Customer = mongoose.model("customer", customerSchema);






// created a async function to add orders in the database.
const addOrders = async() => {
    let res = await Order.insertMany([
        {item : "Laptop", price : 75000},
        {item : "Mobile", price : 25000},
        {item : "Tablet", price : 35000},
    ]);
    console.log(res);

    let result = await Order.find({});
    console.log(result);
}
// addOrders();







const addcustomers = async() => {
    // const customer1 = new Customer({
    //     name : "Amrinder Singh",        6ae6eafc4774c001a9492621
    // });
    // let order1 = await Order.findOne({item : "Laptop"});
    // let order2 = await Order.findOne({item : "Mobile"});
    // let order3 = await Order.findOne({item : "Tablet"});

    // customer1.orders.push(order1);
    // customer1.orders.push(order2);
    // customer1.orders.push(order3);

    // let res = await customer1.save();
    // console.log(res);
}
// addcustomers();  

 




// add new customer
const addcust = async () => {
    const newcust = new Customer({
          name : "Arjun singh",
    });
    const neworder = new Order({
       item : "Mozzila Cheez fire",
       price : 550
    });
    newcust.orders.push(neworder);

    let ans1 = await newcust.save();
    console.log(ans1);
    let ans2 = await neworder.save();
    console.log(ans2);
}
// addcust();




// function to delete a customer from the database.
// hm jis bi customer ko delete karenge uske saath hi uske orders bhi delete ho jaenge because hmne customerSchema me post hook ka use kiya hai aur usme findOneAndDelete() method ka use kiya hai. isse jaise hi kisi customer ko delete kiya jaye to ye middleware uske orders ko bhi delete kar dega.
const deleteCust = async () => {
    let result = await Customer.findByIdAndDelete("6ae9e73612ef994f2c7ba15f");
    console.log(result);
}
// deleteCust();



// function to find the customers and their orders in the database.
const findCollections = async() => {
    let result1 = await Customer.find({}).populate("orders");
    console.log(result1);
    let result2 = await Order.find({});
    console.log(result2);
}    
findCollections();


























// Imp:
// 1. In the above code we have created a customerSchema and orderSchema and then we have created a model for both of them.
// 2. In the orderSchema we have created two fields item and price which are of type String and Number respectively.
// 3. In the customerSchema we have created a field called orders which is an array of ObjectIds and we have referenced the Order model in it.
// 4. In the addOrders function we have inserted some orders in the Order collection and then we have found those orders and logged(print) them in the console. 
// 5. In the addcustomers function we have created a customer1 object and then we have found the orders from the Order collection through database and then we have pushed those orders into the orders array of the customer1 object and then we have saved the customer1 object in the Customer collection.

// Imp key diff
// when we save the output of customer1 and print in the console the moongoose will give the full documents in the order array as a result 
// but when we check the result of same in the mongo database then they just show the object-id of the orders. because in the customer schema we define the type of an order array is(object-id). that is why they give only the object id is in one single array of inside one single document of an array not the whole document.
// If we want to get the full document of the orders in the customer collection then we have to use the populate method of mongoose. we will see that in the next code snippet.
// created a async function to get the customers with their orders populated.
// const getCustomersWithOrders = async() => {
//     let customers = await Customer.find({}).populate("orders");
//     // access through the different ways.
//     console.log(customers);
//     console.log(orders[0].item); // Laptop
//     console.log(customers[0].orders[0].item); // Laptop
// }

// 2 thing.............
// All about handling deletion of a customer and its orders in the database.
// hm chahte hei ki jaise hi kisi customer ko delete kiya jaye to uske saath hi uske orders bhi delete ho jaye. but sabse phele hm normal deletion dekhte hein by [ findByIdAndDelet() ] ka use krenge. isse sirf customer delete hoga but uske orders delete nahi honge. to iske liye hmne ek middleware ka use karenge jo ki customer ke schema me likha jaega ye middleware pre hook ke roop me kaam karega aur jaise hi kisi customer ko delete kiya jaye to ye middleware uske orders ko bhi delete kar dega. iske liye hmne customerSchema me pre hook ka use kiya hai aur usme findOneAndDelete() method ka use kiya hai. isse jaise hi kisi customer ko delete kiya jaye to ye middleware uske orders ko bhi delete kar dega.
// iski implenetation upar model crete krna se phele ki gyi hei..

// This function(addcust) is created for the purpose of adding a new customer with a new order. In this function we have created a new customer object and then we have created a new order object and then we have pushed the new order object into the orders array of the new customer object and then we have saved both the objects in their respective collections.