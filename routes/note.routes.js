const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticator } = require("../middlewares/authenticator");
const { NoteModel } = require("../models/NoteModel");
const { token } = require("morgan");

const noteRouter = express.Router();
noteRouter.use(authenticator)

noteRouter.get("/", async (req, res) => {
    let token = req.headers.authorization
    jwt.verify(token, "Nikan",async (error, decode) => {
        try {
            let data = await NoteModel.find({user:decode.userId})
            res.send({
                data:data,
                message:"Success",
                status:1
            })
        } catch (error) {
            res.send({
                message:error.message,
                status:0
            })
        }
    })

    
})

noteRouter.post("/create", async (req, res) => {
    try {
        let note = new NoteModel(req.body)
        await note.save()
        res.send({
            message: "Note created",
            status: 1
        })
    } catch (error) {
        res.send({
            message: error.message,
            status: 0
        })
    }
})


noteRouter.patch("/", async (req, res) => {
    let { id } = req.headers;
    try {
      const updatedNote = await NoteModel.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true } // Ensure to fetch the updated note after the update
      );
      res.send({
        message: "Note updated",
        status: 1,
        data: updatedNote, // Send back the updated note
      });
    } catch (error) {
      res.send({
        message: error.message,
        status: 2,
      });
    }
  });
  

noteRouter.delete("/",async(req,res) => {
    let {id} = req.headers
    try {
        await NoteModel.findByIdAndDelete({_id:id})
        res.send({
            message:"Note deleted",
            status:1
        })
    } catch (error) {
        res.send({
            message:error.message,
            status:2
        })
    }
    
})

module.exports = {
    noteRouter
}