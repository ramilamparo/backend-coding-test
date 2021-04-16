declare const _default: {
    handler: string;
    events: {
        http: {
            method: string;
            path: string;
            request: {
                schema: {
                    "application/json": {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                            };
                        };
                        readonly required: readonly ["name"];
                    };
                };
            };
        };
    }[];
};
export default _default;
