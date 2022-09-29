import { Request, Response } from "express";
import {
  CreateCustomerService,
  DeleteCustomerService,
  ListCustomersService,
  ShowCustomerService,
  UpdateCustomerService,
} from "../services";

class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listCustomers = new ListCustomersService();

    const customers = await listCustomers.execute();

    return response.status(200).json(customers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showCustomer = new ShowCustomerService();

    const customer = await showCustomer.execute({ id });

    return response.status(200).json(customer);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const createCustomer = new CreateCustomerService();

    const customer = await createCustomer.execute({ name, email });

    return response.status(201).json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email } = request.body;
    const updateCustomer = new UpdateCustomerService();

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    return response.status(200).json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteCustomer = new DeleteCustomerService();

    await deleteCustomer.execute({ id });

    return response.status(204).json();
  }
}

export default CustomersController;
