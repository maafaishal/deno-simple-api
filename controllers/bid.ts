import { client } from "../config.ts";
import mapResponse from "../helpers/mapResponse.ts";
import toIDR from "../helpers/toIDR.ts";

// @desc    Get history bids
// @route   GET /api/v1/buyer/history-bid

export const getHistoryBids = async ({ request, response }: { request: any, response: any }) => {
  try {
    await client.connect();

    const requestURL = request.url;
    const auctionId = requestURL.searchParams.get('id');
    if(!auctionId) {
      throw new Error("auction id is required");
    }

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
      const auctionDataQuery = await client.query('SELECT highest_bid, product_name, bid_count FROM auctions WHERE auction_id = $1', data.auction_id);
      const auctionDataTemp = mapResponse(auctionDataQuery);
      const auctionData = auctionDataTemp[0];
      if (!auctionData) {
        throw new Error("auction_id not found");
      }

      const highestBid = auctionData.highest_bid || 0;
      const productName = auctionData.product_name || '';
      const bidCount = auctionData.bid_count || 0;
      if (data.price <= highestBid) {
        response.status = 400;
        response.body = {
          success: false,
          highest_bid: highestBid,
          errorMessage: "Your bid is equal or less than current highest bid",
        };
        return;
      }

      // add bid
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

      // update auction highest bid
      await client.query(`
        UPDATE auctions
        SET highest_bid = $1,
            bid_count = $2
        WHERE auction_id = $3`,
        data.price,
        bidCount + 1,
        data.auction_id,
      );

      // add notif for current user
      await client.query(`
        INSERT INTO notification(
          title,
          detail,
          created_date,
          user_id,
          type
        ) VALUES($1,$2,$3,$4,$5)`,
        'Kamu berhasil melakukan penawaran',
        `Kamu berhasil melakukan penawaran pada produk "${productName}" di harga ${toIDR(data.price)}`,
        new Date(),
        data.user_id,
        'info'
        );

      // get other user
      const otherUser = await client.query('SELECT user_id FROM bidding_history WHERE auction_id = $1 AND user_id !=$2', data.auction_id, data.user_id);
      const otherUserRows = otherUser.rows[0] || [];
      
      for(let i = 0;i < otherUserRows.length;i++) {
        const otherUserId = otherUserRows[i];
        // add notif for other user
        await client.query(`
        INSERT INTO notification(
          title,
          detail,
          created_date,
          user_id,
          type
        ) VALUES($1,$2,$3,$4,$5)`,
        'Seseorang telah mengalahkan penawaranmu',
        `Penawaranmu pada produk "${productName}" telah dikalahkan. Segera naikkan penawaranmu untuk memenangkan lelang.`,
        new Date(),
        otherUserId,
        'info'
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
