"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const notion_routes_1 = __importDefault(require("./routes/notion.routes"));
const blogs_routes_1 = __importDefault(require("./routes/blogs.routes"));
const author_routes_1 = __importDefault(require("./routes/author.routes"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to blog api",
        version: "1.0.0",
        dev: "Gyanaranjan Patra"
    });
});
app.use("/api/v1/notion/blogs", notion_routes_1.default);
app.use("/api/v1/blogs", blogs_routes_1.default);
app.use("/api/v1/author", author_routes_1.default);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running @ http://localhost:${process.env.PORT || 3000}`);
});
