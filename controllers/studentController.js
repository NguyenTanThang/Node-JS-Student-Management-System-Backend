const Student = require('../model/Student');
const ROUTE_NAME = "student";
const {encrypt, compare} = require("../utils/encryptor");
const jwt = require("jsonwebtoken");

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();

        return res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getStudentsByName = async (req, res, next) => {
    try {
        const {
            student_name
        } = req.query;

        if (student_name == undefined) {
            next();
        }

        let students = await Student.find();

        students = students.filter(student => {
            return student.name.toLowerCase().includes(student_name.toLowerCase())
        })

        return res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getStudentByID = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const student = await Student.findById(id);

        return res.status(200).json({
            success: true,
            data: student
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const addStudent = async (req, res) => {
    try {
        let {
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom
        } = req.body;

        const existedUser = await Student.findOne({email})

        if (existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: `Please enter a valid email`
            })
        }

        password = encrypt(password);

        const newStudent = await new Student({
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
            data: newStudent,
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

const editStudent = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedStudent = await Student.findById(id);
        if (!existedStudent){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let updatedStudent = await Student.findByIdAndUpdate(id, req.body)
        updatedStudent = await Student.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedStudent,
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

const deleteStudent = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedStudent = await Student.findById(id);
        if (!existedStudent){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let deletedStudent = await Student.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            data: deletedStudent,
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

        const existedUser = await Student.findOne({email});

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
        console.log(error)
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getStudentByClassName = async (req, res) => {
    try {
        const {
            class_name
        } = req.params;

        let students = await Student.find({assigned_classroom: class_name})

        console.log(students);

        return res.status(200).json({
            success: true,
            data: students
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
    getAllStudents,
    getStudentsByName,
    getStudentByID,
    addStudent,
    editStudent,
    deleteStudent,
    login,
    getStudentByClassName
}