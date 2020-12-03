import { Client } from "https://deno.land/x/postgres/mod.ts";
import { multiParser } from "https://deno.land/x/multiparser/mod.ts";

import { dbCreds } from "../config.ts";

import { AUCTION_STATUS_REJECTED_ID } from "../constants/index.ts";

import mapResponse from "../helpers/mapResponse.ts";
import sanitizeFormData from "../helpers/sanitizeFormData.ts";

// Init Client
const client = new Client(dbCreds);
// const client = new Client("postgres://firzzido:QumdHkUI-bg7tfI-TPG6JWIrNB8dCotk@topsy.db.elephantsql.com:5432/firzzido");
// const client = new Client(
//   "postgres://pifbqfzzeokxen:9a821e98c76b3e5e5411d2924094bb2313b9cf58b03cd85820687bfd9d592836@ec2-54-235-158-17.compute-1.amazonaws.com:5432/d4amg6rg6ei84n"
// );

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
    const auctionId = Number(params.auction_id || 0);

    if (!auctionId && auctionId !== 0) {
      throw new Error("There is no auction_id");
    }

    console.log("hallo!!!!!", auctionId);

    await client.connect();

    console.log("hallo :)", auctionId);

    const result = await client.query(
      "SELECT * FROM auctions WHERE auction_id=$1",
      auctionId
    );

    console.log("hallo");

    let reasonsData = "";
    const data = mapResponse(result);

    console.log("data", data);

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
    const formData: any = (await multiParser(request.serverRequest)) || {};
    const fieldsData = formData.fields || {};
    const auctionId = Number(
      sanitizeFormData(fieldsData.auction_id || "") || 0
    );
    const status = Number(sanitizeFormData(fieldsData.status || "") || 0);
    const reasons = sanitizeFormData(fieldsData.reasons || "");

    console.log("fieldsData", fieldsData);
    console.log("auctionId", sanitizeFormData(fieldsData.auction_id || ""));
    console.log("status", status);

    if (!auctionId && auctionId !== 0) {
      throw new Error("There is no auction_id");
    }

    if (!status) {
      throw new Error("There is no status");
    }

    const isReject = status === AUCTION_STATUS_REJECTED_ID

    if (isReject && !reasons) {
      throw new Error("There are no reasons");
    }

    await client.connect();

    const auction =
      (await client.query(
        "SELECT auction_id FROM auctions WHERE auction_id=$1",
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

    console.log("resultUpdate", resultUpdate);

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
