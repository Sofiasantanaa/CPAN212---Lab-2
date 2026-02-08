import { documentRepository } from "../repositories/documentRepository.js";
import { appendAudit } from "../utils/fileStore.js";
import { nowIso } from "../utils/time.js";
import fs from "fs/promises";
import path from "path";
import { PATHS } from "../config.js";

export const documentService = {

  async deletePhysical(id) {
    const existing = await documentRepository.getById(id);

    if (!existing) {
      return { ok: false, status: 404, message: "Document not found" };
    }

    if (existing.status !== "REJECTED") {
      return {
        ok: false,
        status: 409,
        message: "Physical deletion allowed only for REJECTED documents"
      };
    }

    const filePath = path.join(PATHS.BLOB_DIR, `${id}.txt`);

    await fs.unlink(filePath);
    await documentRepository.deleteById(id);

    await appendAudit({
      action: "DELETE_PHYSICAL",
      docId: id,
      timestamp: nowIso()
    });

    return { ok: true, message: "Document physically deleted" };
  }
};


