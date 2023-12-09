const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
const options = [
  cors({
    origin: ['https://cubitose.netlify.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
];

app.use(options);
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
    const teams = cubitoseDBCollection.collection("teams")


    // JWT 
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
      res.send({ token })
    })
    // Insert Teams Data
    app.post('/teams', async (req, res) => {
      const newTeam = req.body;
      const result = await teams.insertOne(newTeam);
      res.send(result)
    })
    // Get Teams Data
    app.get('/teams', async (req, res) => {
      const cursor = teams.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // Delete Single Team Data
    app.delete('/teams/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await teams.deleteOne(query)
      res.send(result);
    })
    // Get Single Team Data
    app.get("/teams/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await teams.findOne(query)
      res.send(result)
    })
    // Update Single Team Data
    app.put('/teams/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTeam = req.body;
      const upTeam = {
        $set: {
          teamName: updateTeam.teamName,
          teamRole: updateTeam.teamRole,
          teamImg: updateTeam.teamImg,
          teamFacebook: updateTeam.teamFacebook,
          teamInstagram: updateTeam.teamInstagram,
          teamTwitter: updateTeam.teamTwitter,
          teamLinkedIn: updateTeam.teamLinkedIn,
          teamWebsite: updateTeam.teamWebsite,
        },
      }
      const result = await teams.updateOne(filter, upTeam, options)
      res.send(result);
    })
    // insert portfolio data
    app.post('/portfolio', async (req, res) => {
      const newPortfolio = req.body;
      const result = await portfolio.insertOne(newPortfolio);
      res.send(result)
    })

    // Get Portfolio data
    app.get('/portfolio', async (req, res) => {
      const cursor = portfolio.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // Delete Single Portfolio data
    app.delete('/portfolio/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await portfolio.deleteOne(query)
      res.send(result);
    })
    // Update Single Portfolio data
    app.put('/portfolio/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatePortfolio = req.body;
      const upPortfolio = {
        $set: {
          portfolioName: updatePortfolio.portfolioName,
          portfolioShortDescription: updatePortfolio.portfolioShortDescription,
          portfolioDetails: updatePortfolio.portfolioDetails,
          portfolioThumbnail: updatePortfolio.portfolioThumbnail,
          portfolioLink: updatePortfolio.portfolioLink,
          portfolioCategory: updatePortfolio.portfolioCategory,
          portfolioYear: updatePortfolio.portfolioYear,
          portfolioCountry: updatePortfolio.portfolioCountry,
          portfolioClientName: updatePortfolio.portfolioClientName,
          portfolioServiceCategory: updatePortfolio.portfolioServiceCategory,
        },
      }
      const result = await portfolio.updateOne(filter, upPortfolio, options)
      res.send(result);
    })
    // Web Development Portfolio data
    app.get('/portfolio/web-development', async (req, res) => {
      const query = { portfolioServiceCategory: "Web-Development" };
      const cursor = portfolio.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    // Graphics Design Portfolio data
    app.get('/portfolio/graphics-design', async (req, res) => {
      const query = { portfolioServiceCategory: "Graphics-Design" };
      const cursor = portfolio.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    // Digital-Marketing Portfolio data
    app.get('/portfolio/digital-marketing', async (req, res) => {
      const query = { portfolioServiceCategory: "Digital-Marketing" };
      const cursor = portfolio.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    // Get Single Portfolio data
    app.get("/portfolio/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await portfolio.findOne(query)
      res.send(result)
    })

    // Insert Review data
    app.post('/review', async (req, res) => {
      const newReview = req.body;
      const result = await review.insertOne(newReview);
      res.send(result)
    })
    // Get review data
    app.get('/review', async (req, res) => {
      const cursor = review.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // Web Development Review
    app.get('/review/web-development', async (req, res) => {
      const query = { serviceCategory: "Web-Development" };
      const cursor = review.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    // Graphics Design Review
    app.get('/review/graphics-design', async (req, res) => {
      const query = { serviceCategory: "Graphics-Design" };
      const cursor = review.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    // Digital Marketing Review
    app.get('/review/digital-marketing', async (req, res) => {
      const query = { serviceCategory: "Digital-Marketing" };
      const cursor = review.find(query);
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