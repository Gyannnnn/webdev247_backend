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
exports.getAuthorByName = exports.createAuthor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const zod_1 = __importDefault(require("zod"));
const createAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default.object({
            authorName: zod_1.default.string().min(4, "Name is required"),
            authorBio: zod_1.default.string().min(10, "Bio must be of 10 characters"),
            authorLocation: zod_1.default.string(),
            authorAvatar: zod_1.default.string().url(),
            authorLinkedin: zod_1.default.string().url("Must be Linkedin Profile url "),
            authorX: zod_1.default.string().url("Must be a x profile url"),
        });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid input",
                error: result.error,
            });
            return;
        }
        const { authorName, authorBio, authorLocation, authorAvatar, authorLinkedin, authorX, } = result.data;
        const newAuthor = yield prisma.author.create({
            data: {
                authorName,
                authorBio,
                authorLocation,
                authorAvatar,
                authorLinkedin,
                authorX,
            },
        });
        if (!newAuthor) {
            res.status(400).json({
                message: "Failed to create new Author"
            });
            return;
        }
        res.status(200).json({
            message: `${newAuthor.authorName} is now Author`
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});
exports.createAuthor = createAuthor;
const getAuthorByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!(name === null || name === void 0 ? void 0 : name.trim())) {
        res.status(400).json({
            message: "All fields are required"
        });
    }
    console.log(name);
    try {
        const author = yield prisma.author.findFirst({
            where: {
                authorName: name
            }
        });
        console.log(author);
        if (!author) {
            res.status(404).json({
                message: "No Author found"
            });
            return;
        }
        res.status(200).json({
            message: "Author found successfully",
            author: author
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});
exports.getAuthorByName = getAuthorByName;
