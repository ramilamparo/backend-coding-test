"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFactory = void 0;
const firebase_1 = require("../../config/firebase");
const firebase = __importStar(require("firebase-admin"));
const FirebaseAuth_1 = require("./FirebaseAuth");
const FirebaseFirestore_1 = require("./FirebaseFirestore");
class FirebaseFactory {
}
exports.FirebaseFactory = FirebaseFactory;
FirebaseFactory.firebaseApp = firebase.initializeApp(firebase_1.serviceAccount);
FirebaseFactory.getFirebaseAuth = () => {
    return FirebaseAuth_1.FirebaseAuth.create(FirebaseFactory.firebaseApp);
};
FirebaseFactory.getFirebaseFirestore = () => {
    return FirebaseFirestore_1.FirebaseFirestore.create(FirebaseFactory.firebaseApp);
};
//# sourceMappingURL=FirebaseFactory.js.map