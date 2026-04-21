const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* ✅ Middleware */
app.use(express.json());
app.use(express.static(__dirname));

/* 🔗 MongoDB Atlas Connection */
mongoose.connect("mongodb+srv://admin123:admin@cluster0.te7unfs.mongodb.net/messagesDB?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

/* 📦 Schema */
const messageSchema = new mongoose.Schema({
    text: String,
    time: String
});

const Message = mongoose.model("Message", messageSchema);

/* 📩 Save Message */
app.post("/submit", async (req, res) => {
    try {
        const { text } = req.body;

        const newMessage = new Message({
            text: text,
            time: new Date().toLocaleString()
        });

        await newMessage.save();

        res.json({ success: true });
    } catch (err) {
        console.log("❌ Save Error:", err);
        res.status(500).send("Error saving message");
    }
});

/* 📤 Get ALL Messages */
app.get("/data", async (req, res) => {
    try {
        const data = await Message.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        console.log("❌ Fetch Error:", err);
        res.status(500).send("Error fetching data");
    }
});

/* 🏠 Default route (optional) */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/* 🔥 IMPORTANT FOR RENDER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
