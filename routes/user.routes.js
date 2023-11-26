const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

userRouter.get("/", (req, res) => {
    res.send("all the users");
});

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();
        res.send({
            message: "user created",
            status: 1,
        });
    } catch (error) {
        res.send({
            message: error.message,
            status: 0,
        });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let option = {
        expiresIn: "5m"
    };

    try {
        const data = await UserModel.find({ email });
        if (data.length > 0) {
            const token = jwt.sign({ userId: data[0]._id }, "Nikan", option);
            const result = await bcrypt.compare(password, data[0].password);

            if (result) {
                res.send({
                    message: "User logged in successfully",
                    token: token,
                    status: 1
                });
                return;
            } else {
                res.send({
                    message: "Incorrect password",
                    status: 0
                });
                return;
            }
        } else {
            res.send({
                message: "User does not exist",
                status: 0
            });
            return;
        }
    } catch (error) {
        res.send({
            message: error.message,
            status: 0
        });
    }
});

module.exports = { userRouter };
