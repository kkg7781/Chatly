import express from "express"
const router=express.Router();
router.get("/signup",(req,res)=>{
res.send("signup form")
})
router.get("/login",(req,res)=>{
res.send("login route")
})
export default router