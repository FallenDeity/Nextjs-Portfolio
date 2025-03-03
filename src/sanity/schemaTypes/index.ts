import { type SchemaTypeDefinition } from "sanity";

import { authorType } from "./authorType";
import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { educationType } from "./educationType";
import { experienceType } from "./experienceType";
import { postType } from "./postType";
import { profileType } from "./profileType";
import { projectType } from "./projectType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		blockContentType,
		categoryType,
		postType,
		authorType,
		educationType,
		experienceType,
		profileType,
		projectType,
	],
};
