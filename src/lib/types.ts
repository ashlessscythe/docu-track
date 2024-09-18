export interface Approval {
	id: string;
	status: string;
	created_at: string;
	documents: { title: string };
	users: { full_name: string };
}

export interface Document {
	id: string;
	title: string;
	created_at: string;
}
