import { Hono } from "hono";
import { getSanitySDK } from "../request-sdk";
import { Product } from "../generated/sdk";

export const sanityRoute = new Hono()
  .use(getSanitySDK)
  .get("/products", async (c) => {
    const query = c.req.query("q")?.toUpperCase();

    let products: Array<Product> = [];

    const start = performance.now();

    if (query) {
      const data = await c.var.sdk.getProductByName({ name: query });

      products = data.allProduct;
    } else {
      const data = await c.var.sdk.getAllProducts();
      products = data.allProduct;
    }

    const end = performance.now();

    return c.json({
      success: 1,
      data: {
        products,
        duration: end - start,
      },
    });
  })
  .get("/categories", async (c) => {
    const start = performance.now();

    const data = await c.var.sdk.getAllCategory();

    const category = data.allProductLevel1Category;

    const end = performance.now();

    return c.json({
      success: 1,
      data: {
        category,
        duration: end - start,
      },
    });
  });
