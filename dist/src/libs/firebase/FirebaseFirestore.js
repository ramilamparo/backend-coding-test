"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFirestore = void 0;
class FirebaseFirestore {
    constructor(firestore) {
        this.firestore = firestore;
        this.create = async (collectionName, documentValue) => {
            const newDocument = this.firestore.collection(collectionName).doc();
            await newDocument.create(documentValue);
            return {
                id: newDocument.id,
                ...documentValue
            };
        };
        this.getOne = async (collectionName, documentId) => {
            const foundDocument = (await this.firestore
                .collection(collectionName)
                .doc(documentId)
                .get());
            return foundDocument;
        };
        this.update = async (collectionName, documentId, newValue) => {
            await this.firestore
                .collection(collectionName)
                .doc(documentId)
                .set(newValue, {
                merge: true
            });
            const found = await this.getOne(collectionName, documentId);
            if (!found) {
                throw new Error("Cannot update collection!");
            }
            return found;
        };
        this.delete = async (collectionName, documentId) => {
            await this.firestore.collection(collectionName).doc(documentId).delete();
        };
    }
}
exports.FirebaseFirestore = FirebaseFirestore;
FirebaseFirestore.create = (app) => {
    return new FirebaseFirestore(app.firestore());
};
//# sourceMappingURL=FirebaseFirestore.js.map