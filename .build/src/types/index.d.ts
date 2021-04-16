export declare type DateTypesToUnix<T extends object> = {
    [K in keyof T]: T[K] extends Date ? number : T[K];
};
export declare type UserRole = "admin" | "standard";
