import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Product";
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository";
import RedisCache from "@shared/cache/RedisCache";

class ListProductsService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const redisCache = new RedisCache();

    let products = await redisCache.recover<Product[]>(
      "api-vendas-PRODUCTS-LIST",
    );

    if (!products) {
      products = await productsRepository.find();

      await redisCache.save("api-vendas-PRODUCTS-LIST", products);
    }

    return products;
  }
}

export default ListProductsService;
