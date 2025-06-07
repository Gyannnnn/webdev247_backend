import { Router } from "express";
const notionRouter = Router();

import {
  fetchAllBlogs,
  fetchBlogByTitle,
  fetchPageBlockById,
  fetchReadyBlogs,
  notionHello,
  setBlogLive,
} from "../controller/notion.controller";

notionRouter.get("/hello", notionHello);
notionRouter.get("/all", fetchAllBlogs);
notionRouter.get("/ready", fetchReadyBlogs);

notionRouter.get("/title/:title",fetchBlogByTitle)
notionRouter.get("/id/:notionBlogId",fetchPageBlockById)
notionRouter.put("/setlive/:notionBlogId",setBlogLive)

export default notionRouter;
