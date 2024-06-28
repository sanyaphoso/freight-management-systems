import Router from "express-promise-router";
import { validateToken } from "../../util/jwt";
import { createUnit, deleteUnit, getAllUnit, getUnit, updateUnit } from "./unit";

const unitRouter = Router();
unitRouter.get("/", validateToken, getAllUnit);
unitRouter.get("/:id", validateToken, getUnit);
unitRouter.post("/", validateToken, createUnit);
unitRouter.put("/:id", validateToken, updateUnit);
unitRouter.delete("/:id", validateToken, deleteUnit);

export default unitRouter;
