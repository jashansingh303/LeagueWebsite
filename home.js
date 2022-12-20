const express = require("express")
const router = express.Router()

router.get("/", async (req, res) =>{
    res.json({
        status: 200,
        message: "Sucess"
    })
})

module.exports = router