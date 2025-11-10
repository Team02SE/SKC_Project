export type Coding = {
	id: number; // number in databse
	name: string;
	number: number;
	type: string;
	description: string;
	parent_id?: number;
	children: Coding[];
	expanded: boolean;
	category: string;
};

export type WorkflowDocument = {
	id: number;
	Title: string;
	Source: string;
	Essence: string;
	Conclusion: string;
	Status: number;
	UpdatedAt: string;
};
