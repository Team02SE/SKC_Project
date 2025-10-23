export type Coding = {
	id: number;
	name: string;
	number: number;
	type: string;
	description: string;
	parent_id?: number;
	children: Coding[];
	expanded: boolean;
};
