import middy from "@middy/core";
export declare const middyfy: (handler: any) => middy.Middy<unknown, unknown, import("aws-lambda").Context>;
