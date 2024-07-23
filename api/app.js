import { log } from "console";
import express from "express";

const app = express();


app.use("/api/test", (req, res) => {
    res.send("It works");
})


console.log("Test")

app.listen(8800, () => {
    console.log("Server is running!!!");
})