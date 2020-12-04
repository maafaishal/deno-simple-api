import { multiParser } from "https://deno.land/x/multiparser/mod.ts";

import { client } from "../config.ts";

import mapResponse from "../helpers/mapResponse.ts";
import sanitizeFormData from "../helpers/sanitizeFormData.ts";

// @desc    Get notification count
// @route   GET /commads/v1/common/notification-count

export const getTotalNotif = async ({
  response,
  request,
}: {
  response: any;
  request: any;
}) => {
  try {
    await client.connect();

    const requestURL = request.url;
    const userId = requestURL.searchParams.get("user_id");

    if (!userId && userId !== 0) {
      throw new Error("There is no user_id");
    }

    const result = await client.query(
      "SELECT COUNT(notification_id) FROM notification WHERE user_id=$1 AND is_read=false",
      userId
    );

    const data = mapResponse(result);
    const totalNotif = Number(data?.[0]?.count || 0);

    await client.end();

    response.body = {
      data: {
        total_notif: totalNotif,
      },
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      errorMessage: e.message || "No data",
    };

    await client.end();
  }
};

// @desc    Get notification
// @route   GET /commads/v1/common/notification

export const getNotif = async ({
  response,
  request,
}: {
  response: any;
  request: any;
}) => {
  try {
    await client.connect();

    const requestURL = request.url;
    const userId = requestURL.searchParams.get("user_id");

    if (!userId && userId !== 0) {
      throw new Error("There is no user_id");
    }

    const result = await client.query(
      "SELECT * FROM notification WHERE user_id=$1 DESC",
      userId
    );

    const data = mapResponse(result);

    await client.end();

    response.body = {
      data,
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      errorMessage: e.message || "No data",
    };

    await client.end();
  }
};

// @desc    Read all notifications
// @route   POST /commads/v1/common/read-notifications

export const readNotif = async ({
  response,
  request,
}: {
  response: any;
  request: any;
}) => {
  try {
    await client.connect();

    const formData: any = (await multiParser(request.serverRequest)) || {};
    const fieldsData = formData.fields || {};
    const userId = Number(sanitizeFormData(fieldsData.user_id || "") || 0);

    if (!userId && userId !== 0) {
      throw new Error("There is no user_id");
    }

    const result = await client.query(
      "UPDATE notification SET is_read=true WHERE user_id=$1 AND is_read=false",
      userId
    );

    await client.end();

    response.body = {
      success: true,
      errorMessage: "",
    };
  } catch (e) {
    response.status = 400;
    response.body = {
      success: false,
      errorMessage: e.message || "No data",
    };

    await client.end();
  }
};
