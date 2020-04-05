const Teacher = require("../model/Teacher");
const ROUTE_NAME = "teacher";
const {encrypt, compare} = require("../utils/encryptor");
const jwt = require("jsonwebtoken");

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();

        return res.status(200).json({
            success: true,
            data: teachers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getTeachersByName = async (req, res, next) => {
    try {
        const {
            teacher_name
        } = req.query;

        if (teacher_name == undefined) {
            next();
        }

        let teachers = await Teacher.find();

        teachers = teachers.filter(teacher => {
            return teacher.name.toLowerCase().includes(teacher_name.toLowerCase())
        })

        return res.status(200).json({
            success: true,
            data: teachers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getTeacherByID = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const teacher = await Teacher.findById(id);

        return res.status(200).json({
            success: true,
            data: teacher
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const addTeacher = async (req, res) => {
    try {
        let {
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom,
        } = req.body;

        const existedUser = await Teacher.findOne({email})

        if (existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: `Please enter a valid email`
            })
        }

        password = encrypt(password);

        const newTeacher = await new Teacher({
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom,
        }).save()

        return res.status(200).json({
            success: true,
            data: newTeacher,
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

const editTeacher = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedTeacher = await Teacher.findById(id);
        if (!existedTeacher){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body)
        updatedTeacher = await Teacher.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedTeacher,
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

const deleteTeacher = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedTeacher = await Teacher.findById(id);
        if (!existedTeacher){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let deletedTeacher = await Teacher.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            data: deletedTeacher,
            message: `Successfully deleted a new ${ROUTE_NAME}`
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

        const existedUser = await Teacher.findOne({email});

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

const getTeacherByClassName = async (req, res) => {
    try {
        const {
            class_name
        } = req.params;

        const teacher = await Teacher.findOne({assigned_classroom: class_name})

        return res.status(200).json({
            success: true,
            data: teacher
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
    getAllTeachers,
    getTeachersByName,
    getTeacherByID,
    addTeacher,
    editTeacher,
    deleteTeacher,
    login,
    getTeacherByClassName
}