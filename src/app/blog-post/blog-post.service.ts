import * as firebaseAdmin from "firebase-admin";
import { serviceAccount } from "../../config/firebase";

const app = firebaseAdmin.initializeApp(serviceAccount);

const firebaseFirestore = app.firestore();

interface FireStoreBlogPostAttributes {
	id: string;
	title: string;
}

export class BlogPostService {
	public getAll = async () => {
		const querySnapshot = await firebaseFirestore.collection("blog-post").get();
		const blogPosts: FireStoreBlogPostAttributes[] = [];
		querySnapshot.forEach((doc) => {
			const blogPost = doc.data() as FireStoreBlogPostAttributes;
			blogPosts.push(blogPost);
		});
		return blogPosts;
	};
}
