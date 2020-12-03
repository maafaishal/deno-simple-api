import { client } from "../config.ts";
import mapResponse from "../helpers/mapResponse.ts";

const PER_PAGE = 2;

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
    const requestURL = request.url;
    const userId = requestURL.searchParams.get("user_id");
    let page = Number(requestURL.searchParams.get("page"));
    const userType = requestURL.searchParams.get("type");

    await client.connect();

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

// @desc    get a auction
// @route   GET /api/v1/common/auction?id=:id

export const getAuction = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    const id = request.url.searchParams.get("id");
    if (!id) {
      throw new Error("Auction id is required");
    } else if (isNaN(Number(id))) {
      throw new Error("Auction id is not valid");
    }

    await client.connect();

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
};
