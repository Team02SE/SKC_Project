// Base type for all codings
export type Coding = {
	id: number; // number in databse
	name: string;
	number: number;
	type: string;
	description: string;
	parent_id?: number;
	children: Coding[] | null;
	created_at?: string;
	updated_at?: string;
	expanded?: boolean;
	isNew?: boolean;
	isOptionsOpen?: boolean;
};

export type Activity = Coding;

export type Effect = Coding;

export type OpportunityStructure = Coding;

export type SystemVulnerability = Coding;

export type DStep = Coding;

export type WorkflowDocument = {
	id: number;
	Title: string;
	Source: string;
	Essence: string;
	Conclusion: string;
	Status: number;
	UpdatedAt: string;
	CreatedAt?: string;
	FileName?: string;
	FileMime?: string;
	FileSize?: number;
};

export type EssenceData = {
	essence: string;
	summary: string;
	conclusion: string;
};

export type Workflow = {
	id: number;
	Activities: Activity[];
	Effects: Effect[];
	Os: OpportunityStructure[];
	Sv: SystemVulnerability[];
	Dsteps: DStep[];
	updated_at: string;
};
