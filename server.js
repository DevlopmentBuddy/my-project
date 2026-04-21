const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

/* 🔗 MongoDB Atlas Connection */
mongoose.connect("mongodb+srv://admin123:admin@cluster0.te7unfs.mongodb.net/messagesDB?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

/* Schema */
const messageSchema = new mongoose.Schema({
    text: String,
    time: String
});

const Message = mongoose.model("Message", messageSchema);

/* Save */
app.post("/submit", async (req, res) => {
    try {
        const { text } = req.body;

        await new Message({
            text,
            time: new Date().toLocaleString()
        }).save();

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

/* Get */
app.get("/data", async (req, res) => {
    try {
        const data = await Message.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});