export enum AccessLevel {
    SU = "SU",
    N = "N",
}

export class UserEntity {
    id!: string;
    name!: string;
    username!: string;
    password!: string;
    document!: string;
    email?: string;
    accessLevel!: AccessLevel;
    status?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(props: UserEntity) {
        if(props) Object.assign(this, props);
    }
}