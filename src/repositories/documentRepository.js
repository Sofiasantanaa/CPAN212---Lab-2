import { readIndex, writeIndex } from "../utils/fileStore.js";

export const documentRepository = {
  async list() {
    return await readIndex();
  },

  async getById(id) {
    const docs = await readIndex();
    return docs.find((d) => d.id === id) ?? null;
  },

  async saveNew(doc) {
    const docs = await readIndex();
    docs.push(doc);
    await writeIndex(docs);
    return doc;
  },
  
  async replaceById(id, replacerFn) {
    const docs = await readIndex();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx < 0) return null;
    const updated = replacerFn(docs[idx]);
    docs[idx] = updated;
    await writeIndex(docs);
    return updated;
  },

  async deleteById(id) {
  const docs = await readIndex();
  const updatedDocs = docs.filter(doc => doc.id !== id);
  await writeIndex(updatedDocs);
  return true;
  }

};
