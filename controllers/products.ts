import { Client } from "https://deno.land/x/postgres/mod.ts";

import { dbCreds } from "../config.ts";

// Init Client
const client = new Client(dbCreds);

// @desc    Get all products
// @route   GET /api/v1/products

export const getProducts = async ({ response }: { response: any }) => {
  try {
    await client.connect();

    const result = await client.query("SELECT * FROM products");

    const productsTemp = [];

    for (let i = 0; i < result.rows.length; i += 1) {
      const product = result.rows[i];
      const tempData: any = {};

      for (let j = 0; j < result.rowDescription.columns.length; j += 1) {
        const column = result.rowDescription.columns[j];

        tempData[column.name] = product[j];
      }

      productsTemp.push(tempData);
    }

    response.body = {
      success: true,
      data: productsTemp,
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
};

// @desc    Get a product
// @route   GET /api/v1/products/:id

export const getProduct = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM products WHERE id=$1",
      params.id
    );

    const productsTemp = [];

    for (let i = 0; i < result.rows.length; i += 1) {
      const product = result.rows[i];
      const tempData: any = {};

      for (let j = 0; j < result.rowDescription.columns.length; j += 1) {
        const column = result.rowDescription.columns[j];

        tempData[column.name] = product[j];
      }

      productsTemp.push(tempData);
    }

    response.body = {
      success: true,
      data: productsTemp,
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
};

// @desc    Add a product
// @route   POST /api/v1/products
export const addProduct = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const product = await body.value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: "No data",
    };
  } else {
    try {
      await client.connect();

      const result = await client.query(
        "INSERT INTO products(name, description, price) VALUES($1,$2,$3)",
        product.name,
        product.description,
        product.price
      );

      response.statue = 201;
      response.body = {
        success: true,
        data: product,
      };
    } catch (e) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: e.message || "No data",
      };
    }
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
export const updateProduct = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const product = await body.value;

    await getProduct({ params: { id: params.id }, response })

    console.log('response.status', response.status)

    if (response.status !== 404) {

      await client.connect();

      const resultUpdate = await client.query(
        "UPDATE products SET name=$1, description=$2,price=$3 WHERE id=$4",
        product.name,
        product.description,
        product.price,
        params.id
      );

      console.log('resultUpdate', resultUpdate)

      response.statue = 201;
      response.body = {
        success: true,
        data: product,
      };
    } else {
      throw new Error()
    }
  } catch (e) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
export const deleteProduct = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const product = await body.value;

    await getProduct({ params: { id: params.id }, response })

    console.log('response.status', response.status)

    if (response.status !== 404) {

      await client.connect();

      const resultUpdate = await client.query(
        "DELETE FrOM products WHERE id=$1",
        params.id
      );

      console.log('resultUpdate', resultUpdate)

      response.statue = 201;
      response.body = {
        success: true,
        data: `Product with id ${params.id} has been deleted`,
      };
    } else {
      throw new Error()
    }
  } catch (e) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
};
