const mongoose = require("mongoose");
const {Schema} = require("mongoose");

main()
  .then(() => {
    console.log("Connected To DB 👍");
  }) 
  .catch((err) => console.log("connection falied 👎 ->" , err.message));

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


const userSchema = Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required: true,
    }
})

const postSchema = Schema({
    content : {
        type: String,
        required: true,
    },
    likes : {
        type : Number,
        required : true
    },

    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const addData = async () => {

    // first for user
    let user1 = new User({
        username : "Amrinder Singh",
        email : "abcdef@yahoo.com"
    })
  
    // second for post
    let post1 = new Post({
        content : "This is my first post",
        likes : 10,
        user : user1._id
    })
    let post2 = new Post({
        content : "This is my second post",
        likes : 20,
        user : user1._id
    })
     let savedUser1 = await user1.save();
     let savedpost = await post1.save();
     let savedpost2 = await post2.save();

     console.log("User Added:", savedUser1);
     console.log("Post Added:", savedpost);
     console.log("Post Added:", savedpost2);
}
// addData();

let findData = async () => {
    let data = await User.find({});
    console.log(data);
  
    let datau = await Post.find({}).populate("user");
    console.log(datau);
}

findData();



// This is created for the purpose of understanding 
// one to squillioins relationship in mongoose. 
// In this example, we have created two models: User and Post. Each post is associated with a user through the user field in the postSchema, which references the User model using the ObjectId type. This allows us to establish a relationship between users and their posts in the database.