import Router from "express-promise-router";
import { validateToken } from "../../util/jwt";
import { createShelf, deleteShelf, getAllShelf, getShelf, updateShelf } from "./shelf";

const shelfRouter = Router();
shelfRouter.get("/", validateToken, getAllShelf);
shelfRouter.get("/:id", validateToken, getShelf);
shelfRouter.post("/", validateToken, createShelf);
shelfRouter.put("/:id", validateToken, updateShelf);
shelfRouter.delete("/:id", validateToken, deleteShelf);

export default shelfRouter;
