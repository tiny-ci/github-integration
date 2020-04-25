export enum RefType
{
    Branch = 'branch',
    Tag = 'tag',
}

export interface INewJobPayload
{
    commit: {
        hash: string;
        ts: string;
        message: string;
        ref: {
            type: RefType;
            name: string;
        };
        web: {
            url: string;
            compare: string;
        };
    };
    repository: {
        id: string;
        name: string;
        web: {
            url: string;
        };
    };
    sender: {
        id: string;
        login: string;
        web: {
            url: string;
            avatar: string;
        };
    };
    owner: {
        id: string;
        login: string;
        web: {
            url: string;
            avatar: string;
        };
    };
}
