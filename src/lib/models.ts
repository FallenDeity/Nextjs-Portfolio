export interface Post {
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	featuredImage: string;
	featuredPost: boolean;
	author: Author;
	categories: Category[];
}

export interface Author {
	name: string;
	photo: string;
	bio: string;
	posts: Post[];
}

export interface Category {
	name: string;
	slug: string;
	posts: Post[];
}

export interface Comment {
	name: string;
	email: string;
	comment: string;
}

export interface Experience {
	title: string;
	company_name: string;
	icon: string;
	iconBg: string;
	date: string;
	points: string[];
}
