export enum RentalProposalsStatus {
    NOVA = "NOVA",
    ANALISE_CREDITO = "ANALISE_CREDITO",
    CONTRATO_EMITIDO = "CONTRATO_EMITIDO",
    ASSINADO = "ASSINADO",
    ATIVO = "ATIVO",
    REPROVADA = "REPROVADA",
    CANCELADA = "CANCELADA",
}

export class RentalProposalsEntity {
    id!: string;
    propertyId!: string;
    userId!: string;
    status!: RentalProposalsStatus;
    deletedAt?: Date;
    deletedBy?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(props: RentalProposalsEntity) {
        Object.assign(this, props);
    }
}