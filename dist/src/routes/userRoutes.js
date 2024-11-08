"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const userValidator_1 = require("../middlewares/validator/userValidator");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", userValidator_1.validateCreateUser, userController_1.default.createUser);
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/login", userValidator_1.validateLogin, userController_1.default.login);
/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get the current user's information
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/me", auth_1.authenticateToken, userController_1.default.getUser);
exports.default = router;
