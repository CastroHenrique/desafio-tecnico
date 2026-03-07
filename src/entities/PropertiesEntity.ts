export enum PropertiesStatus {
    DISPONIVEL = "DISPONIVEL",
    EM_NEGOCIACAO = "EM_NEGOCIACAO",
    ALUGADO = "ALUGADO",
}

export class PropertiesEntity {
    id!: string;
    reference?: number;
    price!: number;
    addressZipCode!: string;
    addressStreet!: string;
    addressNumber!: string;
    addressComplement?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
    status?: PropertiesStatus;
    fullAddress!: string;
    deletedAt?: Date;
    deletedBy?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(props: PropertiesEntity) {
        if(props) Object.assign(this, props);
    }
}