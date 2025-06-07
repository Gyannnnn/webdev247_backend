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
exports.setBlogLive = exports.fetchPageBlockById = exports.fetchBlogByTitle = exports.fetchReadyBlogs = exports.fetchAllBlogs = exports.notionHello = exports.notion = void 0;
const client_1 = require("@notionhq/client");
// notion configuration
exports.notion = new client_1.Client({
    auth: process.env.NOTION_INTEGRATION_SECRET,
});
const notionHello = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: "Hello From notion controller",
    });
});
exports.notionHello = notionHello;
// fetches all blogs on notion
const fetchAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = exports.notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        });
        if (!blogs) {
            res.status(404).json({
                message: "no blogs found!",
            });
            return;
        }
        res.status(200).json({
            message: "Blog fetched successfully",
            blogs: (yield blogs).results,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Something went wrong !",
            error: err.message,
        });
    }
});
exports.fetchAllBlogs = fetchAllBlogs;
// fetches all ready to live blogs on notion
const fetchReadyBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readyBlogs = yield exports.notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: "status",
                select: {
                    equals: "READY",
                },
            },
        });
        if (!readyBlogs) {
            res.status(404).json({
                message: "No READY Blogs found",
            });
            return;
        }
        res.status(200).json({
            message: "Successfully fetched READY Blogs",
            Blogs: readyBlogs,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
});
exports.fetchReadyBlogs = fetchReadyBlogs;
const fetchBlogByTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.params;
    if (!(title === null || title === void 0 ? void 0 : title.trim())) {
        res.status(400).json({
            message: "All fields are required",
        });
        return;
    }
    try {
        const fetchedBlogs = yield exports.notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: "title",
                rich_text: {
                    equals: title,
                },
            },
        });
        if (!fetchedBlogs) {
            res.status(404).json({
                message: "No blogs found",
            });
            return;
        }
        res.status(200).json({
            message: "Fetched successfully",
            blogs: fetchedBlogs,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
});
exports.fetchBlogByTitle = fetchBlogByTitle;
const fetchPageBlockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notionBlogId } = req.params;
    if (!(notionBlogId === null || notionBlogId === void 0 ? void 0 : notionBlogId.trim())) {
        res.status(400).json({
            message: "All fields are required",
        });
    }
    try {
        const blogPageBlock = yield exports.notion.blocks.children.list({
            block_id: notionBlogId,
        });
        res.status(200).json({
            message: "Fetched successfully",
            data: blogPageBlock.results,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal Server error",
            error: err.message,
        });
    }
});
exports.fetchPageBlockById = fetchPageBlockById;
const setBlogLive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notionBlogId } = req.params;
    if (!(notionBlogId === null || notionBlogId === void 0 ? void 0 : notionBlogId.trim())) {
        res.status(400).json({
            message: "All fields are required"
        });
        return;
    }
    try {
        const response = yield exports.notion.pages.update({
            page_id: notionBlogId,
            properties: {
                status: {
                    select: {
                        name: "LIVE"
                    }
                }
            }
        });
        res.status(200).json({
            message: "Updated successfully"
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal Server error",
            error: err.message
        });
    }
});
exports.setBlogLive = setBlogLive;
