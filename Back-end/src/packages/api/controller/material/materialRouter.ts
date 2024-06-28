import Router from "express-promise-router";
import { validateToken } from "../../util/jwt";
import { createMaterial, deleteMaterial, getAllMaterial, getMaterial, updateMaterial } from "./material";

const materialRouter = Router();
materialRouter.get("/", validateToken, getAllMaterial);
materialRouter.get("/:id", validateToken, getMaterial);
materialRouter.post("/", validateToken, createMaterial);
materialRouter.put("/:id", validateToken, updateMaterial);
materialRouter.delete("/:id", validateToken, deleteMaterial);

export default materialRouter;
