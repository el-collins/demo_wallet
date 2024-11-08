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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjutorService = void 0;
//src/services/adjutorService.ts
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
class AdjutorService {
    constructor() {
        this.baseUrl = process.env.ADJUTOR_API_URL;
        this.apiKey = process.env.ADJUTOR_API_KEY;
    }
    static getInstance() {
        if (!AdjutorService.instance) {
            AdjutorService.instance = new AdjutorService();
        }
        return AdjutorService.instance;
    }
    checkKarmaBlacklist(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                if (!this.baseUrl || !this.apiKey) {
                    throw new Error("Adjutor API URL and API key must be defined");
                }
                // 0zspgifzbo.ga
                const response = yield axios_1.default.get(`${this.baseUrl}/verification/karma/${identity}`, {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                });
                if (response.data.status === "success") {
                    return true; // User is blacklisted
                }
                return false;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error) &&
                    ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404 &&
                    ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.status) === "success") {
                    // User is not found in the blacklist
                    return false;
                }
                logger_1.default.error("Error checking karma blacklist:", error);
                throw new Error("Failed to check karma blacklist");
            }
        });
    }
}
exports.AdjutorService = AdjutorService;
