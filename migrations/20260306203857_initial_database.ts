import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.engine("InnoDB");
        table.string("id", 36).unique().primary();
        table.string("name").notNullable();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.string("document").notNullable();
        table.string("email");
        table.enum("accessLevel", ["SU", "N"]).defaultTo("N");
        table.boolean("status").defaultTo(false);
        table.dateTime("deletedAt");
        table.string("deletedBy", 36);
        table
          .dateTime("createdAt")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
          .dateTime("updatedAt")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        table.index(["name"], "idx_users_name");
        table.index(["username"], "idx_users_username");
    });

    await knex("users").insert([
    {
        id: "a4d437ed-b2ef-4c5a-abc9-2ab5c95b294c",
        name: "Desenvolvimento",
        username: "dev",
        email: "dev@site.com",
        password: "$2b$15$drX4x0wBR2BybL00zDxwk.HpBHvg0fYnhtPAjLYf56qg5JyW1G.Dm",
        status: "1",
        accessLevel: "SU",
    },
    ]);

    await knex.schema.createTable("properties", (table) => {
        table.engine("InnoDB");
        table.string("id", 36).primary();
        table.integer("reference").unsigned().notNullable().unique().index();
        table.decimal("price", 10, 2).notNullable().defaultTo(0);
        table.string("addressZipCode", 10).notNullable();
        table.string("addressStreet", 100).notNullable();
        table.string("addressNumber", 10).notNullable();
        table.string("addressComplement", 60);
        table.string("addressNeighborhood", 60).notNullable();
        table.string("addressCity", 60).notNullable();
        table.string("addressState", 2).notNullable();
        table.string("fullAddress").notNullable();
        table.enum("status", ["DISPONIVEL", "EM_NEGOCIACAO", "ALUGADO"]).defaultTo("DISPONIVEL");
        table.dateTime("deletedAt");
        table.string("deletedBy", 36);
        table
            .dateTime("createdAt")
            .notNullable()
            .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
            .dateTime("updatedAt")
            .notNullable()
            .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        table.index(["reference"], "idx_properties_reference");
        table.index(["addressNeighborhood"], "idx_properties_addressNeighborhood");
        table.index(["addressCity"], "idx_properties_addressCity");
        table.index(["addressState"], "idx_properties_addressState");
        table.unique(
            [
                "addressZipCode",
                "addressStreet",
                "addressNumber",
                "addressCity",
                "addressState"
            ],
            {
                indexName: "uq_property_full_address"
            }
        );
    });

    await knex.schema.createTable("rental_proposals", (table) => {
        table.engine("InnoDB");
        table.string("id", 36).primary();
        table.string("propertyId", 36).notNullable();
        table.string("userId", 36).notNullable();
        table.enum("status", [
            "NOVA", 
            "ANALISE_CREDITO", 
            "CONTRATO_EMITIDO",
            "ASSINADO", 
            "ATIVO", 
            "REPROVADA", 
            "CANCELADA"]).defaultTo("NOVA");
        table.dateTime("deletedAt");
        table.string("deletedBy", 36);
        table
            .dateTime("createdAt")
            .notNullable()
            .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
            .dateTime("updatedAt")
            .notNullable()
            .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        table.index(["propertyId"], "idx_rental_proposals_propertyId");
        table.index(["userId"], "idx_rental_proposals_userId");
        table.index(["status"], "idx_rental_proposals_status");
        table.foreign("propertyId").references("properties.id").onDelete("CASCADE");
        table.foreign("userId").references("users.id").onDelete("CASCADE");
    });

    await knex.schema.createTable("proposal_status_histories", (table) => {
        table.engine("InnoDB");
        table.string("id", 36).unique().primary();
        table.string("rentalProposalId", 36).notNullable();
        table.enum("oldStatus", [
            "NOVA",
            "ANALISE_CREDITO",
            "CONTRATO_EMITIDO",
            "ASSINADO",
            "ATIVO",
            "REPROVADA",
            "CANCELADA"
            ]);
            
        table.enum("newStatus", [
            "NOVA",
            "ANALISE_CREDITO",
            "CONTRATO_EMITIDO",
            "ASSINADO",
            "ATIVO",
            "REPROVADA",
            "CANCELADA"
            ]).notNullable();
        table.dateTime("deletedAt");
        table.string("deletedBy", 36);
        table
            .dateTime("createdAt")
            .notNullable()
            .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
            .dateTime("updatedAt")
            .notNullable()
            .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        table.index(["rentalProposalId"], "idx_proposal_status_histories_rentalProposalId");
        table.foreign("rentalProposalId").references("rental_proposals.id").onDelete("CASCADE");
    });

    
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("proposal_status_histories");
    await knex.schema.dropTableIfExists("rental_proposals");
    await knex.schema.dropTableIfExists("properties");
    await knex.schema.dropTableIfExists("users");
}

