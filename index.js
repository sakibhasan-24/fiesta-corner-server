const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PATCH", "DELETE", "PUT"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());
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
    app.get("/food-items", async (req, res) => {
      const query = {};
      const result = await foodItemsCollections.find(query).toArray();
      res.send(result);
    });
    // read single items
    app.get("/food-items/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await foodItemsCollections.findOne(query);
      res.send(result);
    });
    // read types based on type
    app.get("/getFood/:foodType", async (req, res) => {
      //   console.log(req.params.foodTypes);
      const query = { foodType: req.params.foodType };
      const result = await foodItemsCollections.find(query).toArray();
      res.send(result);
    });
    app.delete("/food/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const deletedFood = await foodItemsCollections.deleteOne(filter);
      console.log(deletedFood);
      res.send(deletedFood);
    });
    // update
    app.put("/food-items/edit/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedFood = req.body;
      console.log(updatedFood);
      //   res.send(updatedFood);
      const food = {
        $set: {
          foodName: updatedFood.foodName,
          foodPrice: updatedFood.foodPrice,
          foodDescription: updatedFood.foodDescription,
          foodImage: updatedFood.foodImage,
          foodRating: updatedFood.foodRating,
        },
      };
      try {
        const result = await foodItemsCollections.updateOne(
          filter,
          food,
          options
        );
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
  } finally {
  }
}
serverConnection().catch((err) => console.log(err));

app.get("/", (req, res) => res.send("server is running!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//
