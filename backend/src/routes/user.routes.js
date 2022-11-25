import {Router} from "express";
import expressAsyncHandler from 'express-async-handler';
import User from "../models/user.model.js";
import {generateToken} from "../utils.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post('/user/signin', expressAsyncHandler(async (req, res) => {
    let user = await User.findOne({email: req.body.email}, {createdAt: 0, updatedAt: 0});

    console.log(user)
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {

            user.password = user.password.hidden;

            user = {
                ...user._doc,
                token: generateToken(user)
            }

            res.send(user);
            return
        }
    }
    res.status(401).send({message: 'Invalid email or password'})
}));

export default router;