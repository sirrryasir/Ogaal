import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/authModel.js";
const register = async (req, res) => {
    try {
        const { email, password, fullName, role, ngo_id } = req.body;
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(email, hashedPassword, fullName, role, ngo_id);
        res.status(201).json({ message: "User registered successfully", user });
        return;
    }
    catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "24h" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                ngo_id: user.ngo_id,
            },
        });
        return;
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
export default {
    register,
    login,
};
//# sourceMappingURL=authController.js.map