const mongoose = require('mongoose');

/* connect to the database */
const param = 'mongodb+srv://<user>:<password>@cluster0-q1bj3.mongodb.net/mytest?retryWrites=true&w=majority';
mongoose
  .connect( param, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch( (error) => console.log(error));
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

/* create a schemas and models */
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }]
});
const postSchema = new mongoose.Schema({
  timestamp: String,
  title: String,
  body: String,
  photo: String
});
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

/* data to be inserted */
const userData = [
  {
    email: "user1@domain.com",
    password: "user1",
    posts: []
  },
  {
    email: "user2@domain.com",
    password: "user2",
    posts: []
  },
];

const postData = [
  {
    timestamp: "12 Dec, 13:40pm",
    title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
    photo: "figure01.jpg"
  },
  {
    timestamp: "12 Dec, 13:40pm",
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
    photo: "figure02.jpg"
  },
  {
    timestamp: "12 Dec, 13:40pm",
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
    photo: "figure03.jpg"
  },
]; 

/* drop users collections */
mongoose.connection.dropCollection( 'users', function(err) {
  /* show messages */
  if ( err ) {
    if (err.code === 26)  console.log('-- users collection does not exists');
    else throw err;
  }
  else console.log( "-- users collection dropped" );
  
  /* drop post collections */
  mongoose.connection.dropCollection( 'posts', function(err) {  
    if ( err ) {
      if (err.code === 26)  console.log('-- posts collection does not exists');
      else throw err;
    }
    else console.log( "-- posts collection dropped" );
    
    /* insert data of users */
    User.create( userData, function (err, users) {
      if ( err ) throw err;
      console.log( users + '\n-- users inserted successfully' );
      
      /* insert post */
      Post( postData[0] ).save( function(err, data){
        if ( err ) throw err;
        console.log(data + '\n-- post inserted successfully');
        // user1 references post
        const query = {email: "user1@domain.com"};
        User.findOneAndUpdate( query, {$push: {posts: data.id}}, function(err){
          if ( err ) throw err;
          console.log( '-- reference created' );
        });
      });
      
      /* insert post */
      Post( postData[1] ).save( function(err, data){
        if ( err ) throw err;
        console.log(data + '\n-- post inserted successfully');
        // user1 references post 
        const query = {email: "user1@domain.com"};
        User.findOneAndUpdate( query, {$push: {posts: data.id}}, function(err){
          if ( err ) throw err;
          console.log( '-- reference created' );
        });
      });

      /* insert post */
      Post( postData[2] ).save( function(err, data){
        if ( err ) throw err;
        console.log(data + '\n-- post inserted successfully');
        // user2 references post
        const query = {email: "user2@domain.com"};
        User.findOneAndUpdate( query, {$push: {posts: data.id}}, function(err){
          if ( err ) throw err;
          console.log( '-- reference created' );
        });
      });
      
    });// END insert data of users
  });// END drop post collections
});// END drop collections

//mongoose.disconnect();
