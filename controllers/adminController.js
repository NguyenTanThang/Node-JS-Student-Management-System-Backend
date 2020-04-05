const Admin = require("../model/Admin");
const ROUTE_NAME = "admin";
const {encrypt, compare} = require("../utils/encryptor");
const jwt = require('jsonwebtoken')

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();

        return res.status(200).json({
            success: true,
            data: admins
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getAdminByID = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const admin = await Admin.findById(id);

        return res.status(200).json({
            success: true,
            data: admin
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const addAdmin = async (req, res) => {
    try {
        let {
            email,
            password
        } = req.body;

        const existedUser = await Admin.findOne({email})

        if (existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: `Please enter a valid email`
            })
        }

        password = encrypt(password);

        const newAdmin = await new Admin({
            email,
            password
        }).save()

        return res.status(200).json({
            success: true,
            data: newAdmin,
            message: `Successfully created a new ${ROUTE_NAME}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const editAdmin = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedAdmin = await Admin.findById(id);
        if (!existedAdmin){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let updatedAdmin = await Admin.findByIdAndUpdate(id, req.body)
        updatedAdmin = await Admin.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedAdmin,
            message: `Successfully updated a new ${ROUTE_NAME}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const existedUser = await Admin.findOne({email});

        if (!existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: "The email or password is wrong"
            })
        }

        if (!compare(password, existedUser.password)){
            return res.status(400).json({
                success: false,
                data: null,
                message: "The email or password is wrong"
            })
        }

        const token = jwt.sign({user_id: existedUser._id}, process.env.JWT_SECRET);

        res.setHeader("x-auth-token", token);
        return res.status(200).json({
            success: true,
            data: existedUser,
            message: `Successfully logged in as ${existedUser.email}`,
            token
        }) 
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

module.exports = {
    getAllAdmins,
    getAdminByID,
    addAdmin,
    editAdmin,
    login
}