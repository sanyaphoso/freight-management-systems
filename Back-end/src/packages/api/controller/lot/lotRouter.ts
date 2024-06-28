import Router from "express-promise-router";
import { validateToken } from "../../util/jwt";
import { depositLot, getLotAll, getLotByMaterialId, withdrawLot } from "./lot";

const lotRouter = Router();
lotRouter.get("/", validateToken, getLotAll);
lotRouter.get("/:material_id", validateToken, getLotByMaterialId);
lotRouter.post("/deposit", validateToken, depositLot);
lotRouter.post("/withdraw", validateToken, withdrawLot);

export default lotRouter;
