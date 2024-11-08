"use strict";
// src/services/userService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const walletService_1 = require("./walletService");
const jwt_1 = require("../utils/jwt");
class UserService {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    // Hash password
                    const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
                    // Check if email is already in use
                    const existingUser = yield trx("users")
                        .where({ email: userData.email })
                        .first();
                    if (existingUser) {
                        throw new Error("Email/user is already in use");
                    }
                    // Create user
                    const user = {
                        id: (0, uuid_1.v4)(),
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        password: hashedPassword,
                        phoneNumber: userData.phoneNumber,
                        role: userData.role ? userData.role : "user",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    yield trx("users").insert(user);
                    // Create wallet for user
                    yield walletService_1.walletService.createWallet(user.id, user.email, trx);
                    return user;
                }));
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to create user: ${error.message}`);
                }
                else {
                    throw new Error("Failed to create user: Unknown error");
                }
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.validateCredentials(email, password);
                const token = (0, jwt_1.generateToken)({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                });
                return { user, token };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to login: ${error.message}`);
                }
                else {
                    throw new Error("Failed to login: Unknown error");
                }
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, database_1.db)("users").where({ id: userId }).first();
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = Object.assign(Object.assign({}, userData), { updatedAt: new Date() });
            if (userData.password) {
                updates.password = yield bcrypt_1.default.hash(userData.password, 10);
            }
            const [updatedUser] = yield (0, database_1.db)("users")
                .where({ id: userId })
                .update(updates)
                .returning("*");
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return updatedUser;
        });
    }
    validateCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, database_1.db)("users").where({ email }).first();
            if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                throw new Error("Invalid credentials");
            }
            return user;
        });
    }
    // Generate NUBAN number
    generateNubanNumber() {
        // Generate a random 10-digit number
        const nubanNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        return nubanNumber;
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
