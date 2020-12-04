import { client } from "../config.ts";
import mapResponse from "../helpers/mapResponse.ts";

const PER_PAGE = 10;

// @desc    Get all auctions
// @route   GET /api/v1/common/all-auctions

export const getAllAuctions = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    await client.connect();

    const requestURL = request.url;
    const userId = requestURL.searchParams.get("user_id");
    let page = Number(requestURL.searchParams.get("page"));
    const userType = requestURL.searchParams.get("type");

    let additional = "";

    if (userType === "seller") {
      additional = `WHERE user_id = ${userId}`;
    } else if (userType === "buyer") {
      additional = `WHERE status = 3`;
    }

    if (!page || isNaN(page)) {
      page = 1;
    }
    const paging = `LIMIT ${PER_PAGE} OFFSET ${(page - 1) * PER_PAGE}`;

    const result = await client.query(
      `SELECT * FROM auctions ${additional} ORDER BY created_date, auction_id ASC ${paging}`
    );
    const auctionsTemp = mapResponse(result);

    const dataCount = await client.query(
      `SELECT COUNT(*) FROM auctions ${additional}`
    );
    const count = Number(dataCount.rows[0][0]);

    await client.end();

    response.body = {
      success: true,
      data: auctionsTemp,
      hasNext: count - page * PER_PAGE > 0,
    };
  } catch (e) {
    await client.end();

    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
};

// @desc    get an auction
// @route   GET /api/v1/common/auction?id=:id

export const getAuction = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    await client.connect();

    const id = request.url.searchParams.get("id");
    if (!id) {
      throw new Error("Auction id is required");
    } else if (isNaN(Number(id))) {
      throw new Error("Auction id is not valid");
    }

    const result = await client.query(
      `SELECT * FROM auctions WHERE auction_id = ${id}`
    );
    const auctionsTemp = mapResponse(result);

    await client.end();

    response.body = {
      success: true,
      data: auctionsTemp[0] || null,
    };
  } catch (e) {
    await client.end();
    
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
}

// @desc    add auction(s)
// @route   POST /api/v1/seller/add-auction

export const addAuction = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const value = await body.value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: "No data",
    };
  } else {
    try {
      await client.connect();

      const data = value.data;
      if (!Array.isArray(data)) {
        throw new Error("Data must be array in JSON");
      }

      for(let i = 0;i < data.length;i++) {
        const auction = data[i];
        await client.query(
          "INSERT INTO auctions(user_id, shop_name, product_name, product_description, product_images, multiple, initial_price, final_price, start_date, end_date, highest_bid, created_date, updated_date) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
          auction.user_id,
          auction.shop_name,
          auction.product_name,
          auction.product_description,
          auction.product_images,
          auction.multiple,
          auction.initial_price,
          auction.final_price,
          auction.start_date,
          auction.end_date,
          auction.initial_price,
          new Date(),
          new Date(),
        );
      }

      response.statue = 201;
      response.body = {
        success: true,
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

// @desc    edit an auction
// @route   POST /api/v1/seller/edit-auction

export const editAuction = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const value = await body.value.read();

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: "No data",
    };
  } else {
    try {
      await client.connect();

      const data = value.fields;
      await client.query(`
        UPDATE auctions
        SET multiple = $1,
            initial_price = $2,
            final_price = $3,
            start_date = $4,
            end_date = $5,
            updated_date = $6
        WHERE auction_id = $7`,
        data.multiple,
        data.initial_price,
        data.final_price,
        data.start_date,
        data.end_date,
        new Date(),
        data.auction_id,
      );

      response.statue = 201;
      response.body = {
        success: true,
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

// @desc    edit an auction
// @route   POST /api/v1/seller/delete-auction

export const deleteAuction = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const value = await body.value.read();

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: "No data",
    };
  } else {
    try {
      await client.connect();

      const data = value.fields;
      await client.query(`
        DELETE FROM auctions
        WHERE auction_id = $1 AND user_id = $2`,
        data.auction_id,
        data.user_id,
      );

      response.statue = 201;
      response.body = {
        success: true,
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
