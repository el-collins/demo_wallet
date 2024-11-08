"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../utils/response");
const userService_1 = require("../services/userService");
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield userService_1.userService.createUser(userData);
                (0, response_1.handleResponse)(res, 201, "User created successfully", user);
            }
            catch (error) {
                (0, response_1.handleError)(res, error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userService_1.userService.login(email, password);
                (0, response_1.handleResponse)(res, 200, "Login successful", user);
            }
            catch (error) {
                (0, response_1.handleError)(res, error);
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const user = yield userService_1.userService.getUserById(userId);
                (0, response_1.handleResponse)(res, 200, "User retrieved successfully", user);
            }
            catch (error) {
                (0, response_1.handleError)(res, error);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const userData = req.body;
                const user = yield userService_1.userService.updateUser(userId, userData);
                (0, response_1.handleResponse)(res, 200, "User updated successfully", user);
            }
            catch (error) {
                (0, response_1.handleError)(res, error);
            }
        });
    }
}
exports.default = new UserController();
