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
exports.updateBlog = exports.getBlogsByTitle = exports.publishBlog = exports.getLiveBlogs = exports.notion = void 0;
const client_1 = require("@notionhq/client");
const client_2 = require("@prisma/client");
const prisma = new client_2.PrismaClient();
const zod_1 = __importDefault(require("zod"));
exports.notion = new client_1.Client({
    auth: process.env.NOTION_INTEGRATION_SECRET,
});
const getLiveBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liveBlogs = yield prisma.blog.findMany({
            where: {
                blogStatus: "LIVE",
            },
        });
        console.log(liveBlogs[0].blogTitle);
        if (!liveBlogs || liveBlogs.length === 0) {
            res.status(404).json({
                message: "No Live Blogs found !",
            });
            return;
        }
        res.status(200).json({
            message: "Fetched successfully",
            liveBlogs: liveBlogs,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.getLiveBlogs = getLiveBlogs;
const publishBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { notionBlogId } = req.params;
    if (!(notionBlogId === null || notionBlogId === void 0 ? void 0 : notionBlogId.trim())) {
        res.status(400).json({
            message: "All fields are required",
        });
    }
    try {
        yield exports.notion.pages.update({
            page_id: notionBlogId,
            properties: {
                status: {
                    select: {
                        name: "LIVE",
                    },
                },
            },
        });
        console.log(1);
        const dataBlocks = yield exports.notion.blocks.children.list({
            block_id: notionBlogId,
        });
        const page = yield exports.notion.pages.retrieve({ page_id: notionBlogId });
        console.log(page);
        //@ts-ignore
        const props = page.properties;
        console.log("xxxxxxxxxxxxxxxxxx");
        console.log(props.Author.people[0].name);
        const blogTitle = 
        //@ts-ignore
        ((_b = (_a = props.title) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.map((t) => t.plain_text).join("")) ||
            (
            //@ts-ignore
            (_d = (_c = props.Name) === null || _c === void 0 ? void 0 : _c.title) === null || _d === void 0 ? void 0 : _d.map((t) => t.plain_text).join("")) ||
            null;
        // 2. thumbnail (rich_text or url)
        const thumbnail = ((_g = (_f = (_e = props.Thumbnail) === null || _e === void 0 ? void 0 : _e.rich_text) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.plain_text) || null;
        // 3. blogStatus (select)
        const blogStatus = ((_j = (_h = props.status) === null || _h === void 0 ? void 0 : _h.select) === null || _j === void 0 ? void 0 : _j.name) || null;
        // 4. relatedTags (multi_select)
        //@ts-ignore
        const relatedTags = 
        //@ts-ignore
        ((_l = (_k = props.related_tags) === null || _k === void 0 ? void 0 : _k.multi_select) === null || _l === void 0 ? void 0 : _l.map((tag) => tag.name)) || [];
        // 5. mainTag (select)
        const mainTag = ((_o = (_m = props.main_tag) === null || _m === void 0 ? void 0 : _m.select) === null || _o === void 0 ? void 0 : _o.name) || null;
        const blogAuthor = props.Author.people[0].name;
        // 6. relatedBlogs (multi_select)
        //@ts-ignore
        const relatedBlogs = 
        //@ts-ignore
        ((_q = (_p = props["related blog"]) === null || _p === void 0 ? void 0 : _p.multi_select) === null || _q === void 0 ? void 0 : _q.map((blog) => blog.name)) || [];
        console.log(blogTitle, thumbnail, blogStatus, relatedTags, mainTag, relatedBlogs);
        console.log("======================================");
        const newBlog = yield prisma.blog.create({
            data: {
                blogNotionId: notionBlogId,
                blogTitle: blogTitle,
                thumbnail,
                blogContent: dataBlocks.results,
                blogStatus,
                blogAuthor,
                relatedBlogs,
                relatedTags,
                mainTag,
            },
        });
        console.log(newBlog);
        if (!newBlog) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
        res.status(200).json({
            message: `${blogTitle} published successfully`,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.publishBlog = publishBlog;
const getBlogsByTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogTitle } = req.params;
    if (!(blogTitle === null || blogTitle === void 0 ? void 0 : blogTitle.trim())) {
        res.status(400).json({
            message: "All Fields are required",
        });
    }
    try {
        const blog = yield prisma.blog.findFirst({
            where: {
                blogTitle,
            },
            select: {
                blogId: true,
                blogNotionId: true,
                blogTitle: true,
                thumbnail: true,
                blogContent: true,
                likes: true,
                blogStatus: true,
                blogAuthor: true,
                blogDate: true,
                relatedTags: true,
                mainTag: true,
                relatedBlogs: true,
                comments: true,
            },
        });
        if (!blog) {
            res.status(404).json({
                message: "No Blogs found",
            });
            return;
        }
        res.status(200).json({
            message: "Blog fetched successfully",
            blog: blog,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.getBlogsByTitle = getBlogsByTitle;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default.object({
            notionBlogId: zod_1.default.string().uuid(),
        });
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid input",
                error: result.error,
            });
            return;
        }
        const { notionBlogId } = result.data;
        yield exports.notion.pages.update({
            page_id: notionBlogId,
            properties: {
                status: {
                    select: {
                        name: "LIVE",
                    },
                },
            },
        });
        const dataBlocks = yield exports.notion.blocks.children.list({
            block_id: notionBlogId,
        });
        if (!dataBlocks) {
            res.status(400).json({
                message: "Failed to fetch notion content !",
            });
            return;
        }
        const blog = yield prisma.blog.update({
            where: {
                blogNotionId: notionBlogId,
            },
            data: {
                blogContent: dataBlocks.results,
            },
        });
        if (!blog) {
            res.status(400).json({
                message: "Failed to update blog",
            });
            return;
        }
        res.status(200).json({
            message: `${blog.blogTitle}  updated successfully`,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.updateBlog = updateBlog;
