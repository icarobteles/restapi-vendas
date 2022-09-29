import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors";
import { getCustomRepository } from "typeorm";
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate("api-vendas-PRODUCTS-LIST");

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
