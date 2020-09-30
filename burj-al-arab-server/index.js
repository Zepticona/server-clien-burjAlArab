// Import Modules
const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// Initilize server 
const app = express();

// Initialize Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// Initializing Mongodb variables
const uri = "mongodb+srv://myDbUser:joyBangla64@cluster0.0ebkk.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const serviceAccount = require("./configs/burj-al-arab-76e0e-firebase-adminsdk-36trr-837358b8c6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-76e0e.firebaseio.com"
});


client.connect(err => {
  const bookingCollection = client.db("organicdb").collection("bookings");
  app.post('/addBookings', (req, res) => {
      const newBooking = req.body;
    bookingCollection.insertOne(newBooking)
    .then( result => {
        console.log(result)
    })
  })

  app.get('/bookings', (req, res) => {
        console.log(req.headers.authorization)
        
        const queryEmail = req.query.email;
        const bearer = req.headers.authorization;
        if(bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            console.log(idToken)
            // idToken comes from the client app
            admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
            const tokenEmail = decodedToken.email;
            if(queryEmail === tokenEmail) {
                bookingCollection.find({email: req.query.email})
                .toArray( (err, documents) => {
                    res.send(documents)
                })
            }
            }).catch(function(error) {
            // Handle error
            });
        }
        // idToken comes from the client app
        // admin.auth().verifyIdToken(idToken)
        // .then(function(decodedToken) {
        // let uid = decodedToken.uid;
        // // ...
        // }).catch(function(error) {
        // // Handle error
        // });
      
  })

});


app.listen(4000)

