import { multiParser } from "https://deno.land/x/multiparser/mod.ts";

import { client } from "../config.ts";

import {
  AUCTION_STATUS_REJECTED_ID,
  NOTIF_SUCCESS,
  NOTIF_ERROR,
} from "../constants/index.ts";

import mapResponse from "../helpers/mapResponse.ts";
import sanitizeFormData from "../helpers/sanitizeFormData.ts";

// @desc    Get rejected reasons
// @route   GET /commads/v1/admin/review-reason

export const getReasons = async ({
  response,
  params,
}: {
  response: any;
  params: { auction_id: string };
}) => {
  try {
    await client.connect();
    
    console.log('reason')

    const auctionId = Number(params.auction_id || 0);

    if (!auctionId && auctionId !== 0) {
      throw new Error("There is no auction_id");
    }

    const result = await client.query(
      "SELECT * FROM auctions WHERE auction_id=$1",
      auctionId
    );

    let reasonsData = "";
    const data = mapResponse(result);

    if (data.length > 0) {
      const reason = data?.[0]?.reasons;
      reasonsData = reason ? JSON.parse(reason) : "";
    } else {
      throw new Error("Data is not exist");
    }

    await client.end();

    response.body = {
      data: reasonsData,
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      errorMessage: e.message || "No data",
    };

    await client.end();
  }
};

// @desc    Review a reason
// @route   POST /commads/v1/admin/review

export const reviewAuction = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    await client.connect();

    const formData: any = (await multiParser(request.serverRequest)) || {};
    const fieldsData = formData.fields || {};
    const auctionId = Number(
      sanitizeFormData(fieldsData.auction_id || "") || 0
    );
    const status = Number(sanitizeFormData(fieldsData.status || "") || 0);
    const isReject = status === AUCTION_STATUS_REJECTED_ID;
    const reasons = isReject ? sanitizeFormData(fieldsData.reasons || "") : "";

    if (!auctionId && auctionId !== 0) {
      throw new Error("There is no auction_id");
    }

    if (!status) {
      throw new Error("There is no status");
    }

    if (isReject && !reasons) {
      throw new Error("There are no reasons");
    }

    const auction =
      (await client.query(
        "SELECT user_id, product_name FROM auctions WHERE auction_id=$1",
        auctionId
      )) || {};

    if (auction.rows.length === 0) {
      throw new Error("Data is not exist");
    }

    const resultUpdate = await client.query(
      "UPDATE auctions SET status=$1, reasons=$2 WHERE auction_id=$3",
      status,
      reasons,
      auctionId
    );

    const auctionData = auction?.rows?.[0] || [];
    const userId = auctionData[0] || 0;
    const productName = auctionData[1] || "";

    let title = "Produkmu berhasil disetujui";
    let detail = `Produk "${productName}" berhasil masuk ke pelelangan. Segera pantau produkmu disini.`;
    let type = NOTIF_SUCCESS;

    if (isReject) {
      title = "Produkmu gagal masuk pelelangan";
      detail = `Produk "${productName}" tidak dapat masuk ke pelelangan dikarenakan beberapa hal. <a href="/list" rel="noreferrer noopener" target="_blank">Cek di sini</a>`;
      type = NOTIF_ERROR;
    }

    // send notificationz
    await client.query(
      "INSERT INTO notification(title, detail, user_id, type, created_date) VALUES($1,$2,$3,$4,$5)",
      title,
      detail,
      userId,
      type,
      new Date()
    );

    await client.end();

    response.body = {
      success: true,
      errorMessage: "",
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
