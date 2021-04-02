export type DateTypesToUnix<T extends object> = {
	[K in keyof T]: T[K] extends Date ? number : T[K];
};

export type UserRole = "admin" | "standard";
