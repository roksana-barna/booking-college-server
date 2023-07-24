const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;
// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-ytdlcug-shard-00-00.lvcap8y.mongodb.net:27017,ac-ytdlcug-shard-00-01.lvcap8y.mongodb.net:27017,ac-ytdlcug-shard-00-02.lvcap8y.mongodb.net:27017/?ssl=true&replicaSet=atlas-j6c9nb-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //   await client.connect();
        // perform actions on the collection object
        //   client.close();
        const database = client.db('studentsDB');
        const studentCollection = database.collection('students')
        const databases = client.db('collegeDB');
        const collegeCollection = databases.collection('colleges')

        app.post('/students', async (req, res) => {
            const student = req.body;
            console.log('new student', student)
            const result = await studentCollection.insertOne(student);
            res.send(result);
        });
        app.get('/students',async(req,res)=>{
            const cursor=studentCollection.find()
            const result=await cursor.toArray();
            res.send(result);
          })
          app.get('/colleges',async(req,res)=>{
            const cursor=collegeCollection.find()
            const result=await cursor.toArray();
            res.send(result);
          })
        //   for 3 card
          app.get('/college',async(req,res)=>{
            const cursor=collegeCollection.find().limit(3)
            const result=await cursor.toArray();
            res.send(result);
          })
          app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collegeCollection.findOne(query);
            res.send(result)
          })

    
        app.get('/students', async (req, res) => {
          // console.log(req.headers.authorization);
          let query = {};
          if (req.query?.email) {
    
          }
          const result = await studentCollection.find(query).toArray();
          res.send(result)
        })
await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
        res.send('booking is running')
    })
    app.listen(port, () => {
        console.log('booking is commming')
    })