import { getCustomRepository } from "typeorm";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";
import Customer from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

interface IPaginationCustomer extends PaginationAwareObject {
  data: Customer[];
}

class ListCustomersService {
  public async execute(): Promise<IPaginationCustomer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customers = await customersRepository.createQueryBuilder().paginate();

    return customers;
  }
}

export default ListCustomersService;
