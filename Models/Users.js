const mongoose = require("mongoose");
// const {Schema} = require("mongoose");

main()
  .then(() => {
    console.log("Connected To DB");
  }) 
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
  "mongodb+srv://amxindersingh_db_user:bsjMTpBpp5loIzZK@cluster0.rdlt2k9.mongodb.net/DatabaseRalationship?appName=Cluster"
  );
  console.log("Connected Database:", mongoose.connection.name);

  const admin = mongoose.connection.db.admin();
  const dbsList = await admin.listDatabases();

  console.log("All Databases in Atlas Cluster:");
  dbsList.databases.forEach(db => {
    console.log(` - ${db.name}`);
  });
}

// if you dont want to use Schema directly you can use mongoose.Schema instead of destructuring it from mongoose using a require method.
const userSchema = new mongoose.Schema({
    
  username: {
    type: String,
    required: true,
  },
 address: [
    {
        _id : false,           //hmne isko false isiliye kiya kiuki hmne address ko ek subdocument ke roop me use kiya hai aur hme iske liye alag se id ki jarurat nahi hai.
        city : { 
            type: String,
            required: true
        },
        location : {
            type: String,
            required: true
        }
    }
 ]
});

const User = mongoose.model("User", userSchema);

const addUsers = async () => {
    const user1 = new User({
        username: "Amrinder Singh",
        address: [
           
        {
            city: "Ludhiana",
            location: "Punjab",
        },
        {
            city: "Chandigarh",
            location: "Punjab",
        },
        {
          city: "Bathinda",
          location: "Punjab",
      },
      {
          city: "Moga",
          location: "Punjab",
      },
        ],
    });
    
    //we can also directly push the address object into the existed document address array like this
    user1.address.push({location : "punjab", city : "Amritsar"});

    const result = await user1.save();
    console.log(result);
    }

  // call the function to add users
  addUsers();


// const deleteUsers = async () => {
//   const result = await User.deleteMany({});

//   console.log(result);
// };

// deleteUsers();