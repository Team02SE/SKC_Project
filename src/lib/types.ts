// Base type for all codings
export type Coding = {
	id: number; // number in databse
	name: string;
	number: number;
	type: string;
	description: string;
	parent_id?: number;
	reason?: string;
	children: Coding[] | null;
	created_at?: string;
	updated_at?: string;
	expanded?: boolean;
	isNew?: boolean;
	isDeleted?: boolean;
	isOptionsOpen?: boolean;
};

export type Activity = Coding;

export type Effect = Coding;

export type OpportunityStructure = Coding;

export type SystemVulnerability = Coding;

export type DStep = Coding;

export type WorkflowDocument = {
	// backend (see document.go Document struct)
	id: number;
	Title: string;
	Source: string;
	Essence: string;
	Summary: string;
	Status: number;
	Url?: string;
	FileName?: string;
	Organisation?: string;
	Language: string;
	UpdatedAt: string;
	// js only
	FileMime?: string;
	FileSize?: number;
	CreatedAt?: string;
};

export type EssenceData = {
	essence: string;
	summary: string;
	conclusion: string;
};

export type Workflow = {
	id: number;
	activities: Activity[];
	effects: Effect[];
	'opportunity-structures': OpportunityStructure[];
	'system-vulnerabilities': SystemVulnerability[];
	destep: DStep[];
	updated_at: string;
};
