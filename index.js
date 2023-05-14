const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
require("dotenv").config();
//middle

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ehup0wf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const bookCollection = client.db("book - store").collection("books");

    app.post("/uploadbook", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await bookCollection.insertOne(data);
      res.send(result);
    });

    app.get("/uploadbook", async (req, res) => {
      const book = bookCollection.find();
      const result = await book.toArray();
      res.send(result);
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBookData = req.body;

      const updateDoc = {
        $set: {
          ...updatedBookData,
        },
      };
      const result = await bookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //delete

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Doctor care is running");
});

app.listen(port, () => {
  console.log(`Doctor care is running in : ${port}`);
});

//Lw1jfr3UBQHSTOW9
//book-store
