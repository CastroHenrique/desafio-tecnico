export enum RentalProposalsStatus {
    NOVA = "NOVA",
    ANALISE_CREDITO = "ANALISE_CREDITO",
    CONTRATO_EMITIDO = "CONTRATO_EMITIDO",
    ASSINADO = "ASSINADO",
    ATIVO = "ATIVO",
    REPROVADA = "REPROVADA",
    CANCELADA = "CANCELADA",
}

export const VALID_TRANSITIONS: Record<RentalProposalsStatus, RentalProposalsStatus[]> = {
    [RentalProposalsStatus.NOVA]: [RentalProposalsStatus.ANALISE_CREDITO, RentalProposalsStatus.CANCELADA],
    [RentalProposalsStatus.ANALISE_CREDITO]: [RentalProposalsStatus.CONTRATO_EMITIDO, RentalProposalsStatus.REPROVADA, RentalProposalsStatus.CANCELADA],
    [RentalProposalsStatus.CONTRATO_EMITIDO]: [RentalProposalsStatus.ASSINADO, RentalProposalsStatus.CANCELADA],
    [RentalProposalsStatus.ASSINADO]: [RentalProposalsStatus.ATIVO, RentalProposalsStatus.CANCELADA],
    [RentalProposalsStatus.ATIVO]: [],
    [RentalProposalsStatus.REPROVADA]: [],
    [RentalProposalsStatus.CANCELADA]: [],
};

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