import { ServiceAccount } from "firebase-admin";
import serviceAccountKeyJson from "../../serviceAccountKey.json";

export const serviceAccount: ServiceAccount = {
	clientEmail: serviceAccountKeyJson.client_email,
	privateKey: serviceAccountKeyJson.private_key,
	projectId: serviceAccountKeyJson.project_id
};
