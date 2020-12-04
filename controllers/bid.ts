import { client } from "../config.ts";
import mapResponse from "../helpers/mapResponse.ts";

// @desc    Get history bids
// @route   GET /api/v1/buyer/history-bid

export const getHistoryBids = async ({ request, response }: { request: any, response: any }) => {
  try {
    const requestURL = request.url;
    const auctionId = requestURL.searchParams.get('id');
    if(!auctionId) {
      throw new Error("auction_id is required");
    }

    await client.connect();

    const result = await client.query(`SELECT * FROM bidding_history WHERE auction_id = $1 ORDER BY bid DESC`, auctionId);
    const bidTemp = mapResponse(result);

    response.body = {
      success: true,
      data: bidTemp,
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };
  }
}


// @desc    add bid
// @route   POST /api/v1/buyer/bid-auction

export const addBid = async ({
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
      const latestBidData = await client.query('SELECT highest_bid FROM auctions WHERE auction_id = $1', data.auction_id);
      const latestBidRow = latestBidData.rows[0];
      if (!latestBidRow) {
        throw new Error("auction_id not found");
      }

      if (data.price <= latestBidRow[0]) {
        response.status = 400;
        response.body = {
          success: false,
          highest_bid: latestBidRow[0],
          errorMessage: "Your bid is equal or less than current highest bid",
        };
        return;
      }

      await client.query(`
        INSERT INTO bidding_history(
          auction_id,
          user_id,
          bid,
          bid_date
        ) VALUES($1,$2,$3,$4)`,
        data.auction_id,
        data.user_id,
        data.price,
        new Date(),
      );

      await client.query(`
        UPDATE auctions
        SET highest_bid = $1
        WHERE auction_id = $2`,
        data.price,
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
