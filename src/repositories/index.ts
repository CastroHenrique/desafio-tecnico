import { MySqlPropertiesRepository } from "./properties/MySqlPropertiesRepository";
import { MySqlUsersRepository } from "./users/MySqlUsersRepository";
import { MySqlRentalProposalsRepository } from "./rentalProposals/MySqlRentalProposalsRepository";


export const usersRepository = new MySqlUsersRepository();
export const propertiesRepository = new MySqlPropertiesRepository();
export const rentalProposalsRepository = new MySqlRentalProposalsRepository();