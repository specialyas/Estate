import express from "express";


const router = express.Router();




router.post("/register", (req, res) => {
    console.log("Router works");
})
router.post("/login", (req, res) => {
    console.log("Router works");
})
router.post("/logout", (req, res) => {
    console.log("Router works");
})


export default router;
