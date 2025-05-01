import { Router } from "express";

import {getAllRequirements, getByIdRequirements, insertRequirements, insertRequirementsRequest,
    updateRequirements, updateRequirementsRequest, updateRequirementsStatus,  deleteRequirements
} from "../controllers/requirements.controller.js"

const router = Router();

router.get("/", getAllRequirements)
router.get("/:id",getByIdRequirements)
router.post("/",insertRequirements)
router.post("/request/",insertRequirementsRequest)
router.put("/:id",updateRequirements)
router.put("/request/:id/:status",updateRequirementsRequest)
router.put("/status/",updateRequirementsStatus)
router.delete("/:id",deleteRequirements)

export default router