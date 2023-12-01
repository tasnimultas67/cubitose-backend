const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.himdmth.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const cubitoseDBCollection = client.db("cubitoseDB");
    const portfolio = cubitoseDBCollection.collection("portfolio");
    const review = cubitoseDBCollection.collection("review")

    // insert portfolio data
    app.post('/portfolio', async(req, res) => {
      const newPortfolio = req.body;
      const result = await portfolio.insertOne(newPortfolio);
      res.send(result)
      // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    })
    // Get Portfolio data
    app.get('/portfolio', async(req, res) => {
      const cursor = portfolio.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // Get Portfolio data by ID
    app.get("/portfolio/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await portfolio.findOne(query)
      res.send(result)
    })

  // Insert Review data
    app.post('/review', async(req, res) => {
      const newReview = req.body;
      const result = await review.insertOne(newReview);
      res.send(result)
      // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    })
    // Get review data
    app.get('/review', async(req, res) => {
      const cursor = review.find();
      const result = await cursor.toArray()
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Cubitose is running!')
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log('Cubitose server is running on por', port)
})