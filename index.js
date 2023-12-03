const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@food.wlfdec9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function serverConnection() {
  const foodItemsCollections = client.db("food-items").collection("food-list");
  try {
    await client.connect();
    // create Food
    app.post("/food-items", async (req, res) => {
      const foodData = req.body;
      const result = await foodItemsCollections.insertOne(foodData);
      res.send(result);
    });
  } finally {
  }
}
serverConnection().catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//
