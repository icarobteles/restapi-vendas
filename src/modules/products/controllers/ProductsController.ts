import { Request, Response } from "express";
import {
  CreateProductService,
  DeleteProductService,
  ListProductsService,
  ShowProductService,
  UpdateProductService,
} from "../services";

class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProducts = new ListProductsService();

    const products = await listProducts.execute();

    return response.status(200).json(products);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showProduct = new ShowProductService();

    const product = await showProduct.execute({ id });

    return response.status(200).json(product);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const createProduct = new CreateProductService();

    const product = await createProduct.execute({ name, price, quantity });

    return response.status(201).json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, price, quantity } = request.body;
    const updateProduct = new UpdateProductService();

    const product = await updateProduct.execute({ id, name, price, quantity });

    return response.status(200).json(product);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteProduct = new DeleteProductService();

    await deleteProduct.execute({ id });

    return response.status(204).json();
  }
}

export default ProductsController;
