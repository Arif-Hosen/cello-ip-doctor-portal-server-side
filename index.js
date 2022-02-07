const express = require('express');
const app = express();
const cors = require('cors');

const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://celloIPTechnologyTask:xmoricr1PlUNbLzZ@cluster0.p2nrx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('MongoDB Database connected successfully!!!');

        const database = client.db('celloIpDoctorPortal');
        const patientInfo = database.collection('patientInfo');

        // post patient info to database
        app.post('/patient', async (req, res) => {
            const patient = req.body;
            console.log('hit the post api', patient);
            const result = await patientInfo.insertOne(patient);
            res.json(result);
        })

        // get data from patientInfo collection of database
        app.get('/patientlist', async (req, res) => {
            const cursor = patientInfo.find({});
            const patients = await cursor.toArray();
            res.json(patients);
        })

        // delete patient
        app.delete('/patient/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await patientInfo.deleteOne(query);
            res.json(result);
            // console.log(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello CelloIP Technology Doctor Portal!')
})

app.listen(port, () => {
    console.log(`listening at:${port}`)
})