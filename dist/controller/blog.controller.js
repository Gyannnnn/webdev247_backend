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
exports.getBlogsByTitle = exports.publishBlog = exports.getLiveBlogs = exports.notion = void 0;
const client_1 = require("@notionhq/client");
const client_2 = require("@prisma/client");
const prisma = new client_2.PrismaClient();
exports.notion = new client_1.Client({
    auth: process.env.NOTION_INTEGRATION_SECRET,
});
const getLiveBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liveBlogs = yield prisma.blog.findMany({
            where: {
                blogStatus: "LIVE",
            },
            orderBy: {
                blogDate: "desc",
            },
        });
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
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
        const page = yield exports.notion.pages.retrieve({ page_id: notionBlogId });
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
        const description = ((_q = (_p = (_o = (_m = props.description) === null || _m === void 0 ? void 0 : _m.rich_text) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.text) === null || _q === void 0 ? void 0 : _q.content) || "";
        // 5. mainTag (select)
        const catagory = ((_s = (_r = props.catagory) === null || _r === void 0 ? void 0 : _r.select) === null || _s === void 0 ? void 0 : _s.name) || null;
        const blogAuthor = props.Author.people[0].name;
        // 6. relatedBlogs (multi_select)
        //@ts-ignore
        const relatedBlogs = 
        //@ts-ignore
        ((_u = (_t = props["related blog"]) === null || _t === void 0 ? void 0 : _t.multi_select) === null || _u === void 0 ? void 0 : _u.map((blog) => blog.name)) || [];
        console.log(blogTitle, thumbnail, blogStatus, relatedTags, description, relatedBlogs, "------------------------------", catagory, "-----------------------------------------");
        const authorData = yield prisma.author.findFirst({
            where: {
                authorName: blogAuthor,
            },
        });
        const authorid = authorData === null || authorData === void 0 ? void 0 : authorData.id;
        console.log(`author id ${authorid}`);
        const newBlog = yield prisma.blog.create({
            data: {
                blogNotionId: notionBlogId,
                blogTitle,
                thumbnail,
                blogStatus,
                blogAuthor,
                relatedBlogs,
                relatedTags,
                blogCatagory: catagory,
                blogDescription: description,
                author: {
                    connect: {
                        id: authorid,
                    },
                },
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
        });
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
// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const schema = z.object({
//       notionBlogId: z.string().uuid(),
//     });
//     const result = schema.safeParse(req.params);
//     if (!result.success) {
//       res.status(400).json({
//         message: "Invalid input",
//         error: result.error,
//       });
//       return;
//     }
//     const { notionBlogId } = result.data;
//     await notion.pages.update({
//       page_id: notionBlogId,
//       properties: {
//         status: {
//           select: {
//             name: "LIVE",
//           },
//         },
//       },
//     });
//     const dataBlocks = await notion.blocks.children.list({
//       block_id: notionBlogId,
//     });
//     if(!dataBlocks){
//       res.status(400).json({
//         message: "Failed to fetch notion content !",
//       });
//       return
//     }
//     const blog = await prisma.blog.update({
//       where: {
//         blogNotionId: notionBlogId,
//       }
//     });
//     if (!blog) {
//       res.status(400).json({
//         message: "Failed to update blog",
//       });
//       return;
//     }
//     res.status(200).json({
//       message: `${blog.blogTitle}  updated successfully`,
//     });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
