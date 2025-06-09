import { Router } from "express";
import { createAuthor, getAuthorByName } from "../controller/author/author.controller";
const authorRouter = Router();

authorRouter.post("/create",createAuthor);
authorRouter.get("/get/:name",getAuthorByName)


export  default authorRouter;