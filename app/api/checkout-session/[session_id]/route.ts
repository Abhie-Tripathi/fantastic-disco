import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { format, fromUnixTime } from "date-fns";
import { BASE_URL } from "@/config";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

let cookieHeader = "";

export async function GET(
  req: NextRequest,
  { params }: { params: { session_id: string } }
) {
  console.log("Payment Module: Initiated");
  cookieHeader = req.headers.get("cookie") || "";

  try {
    const userDetail = await fetchUser();

    if (!userDetail.data) {
      console.log("Payment Module: User data not found", userDetail);
      return NextResponse.json(
        { error: userDetail, message: "User not found" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(params.session_id, {
      expand: ["invoice"],
    });

    const email_id = userDetail.data?.email;
    const customerEmail = session.customer_details?.email;
    const sub_expires_at = session.expires_at;
    const plan = session.metadata?.plan;
    const frequency = session.metadata?.planFrequency;
    const currency = session.currency;
    const totalAmountPaid = session.amount_total;
    const paymentStatus = session.payment_status;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    const startDate =
      typeof session.invoice !== "string"
        ? session.invoice?.lines.data[0].period.start
        : null;
    const endDate =
      typeof session.invoice !== "string"
        ? session.invoice?.lines.data[0].period.end
        : null;

    const formattedStartDate = startDate
      ? format(fromUnixTime(startDate), "yyyy-MM-dd")
      : null;
    const formattedEndDate = endDate
      ? format(fromUnixTime(endDate), "yyyy-MM-dd")
      : null;

    let updatePlanResponse = {};
    console.log(`Payment Module: 
      Payment Status: ${paymentStatus}
      Checkout Time: ${Date.now()}
      Checkout Expires At: ${sub_expires_at * 1000}
      Plan: ${plan}
      Total Amount Paid: ${totalAmountPaid}
      Currency: ${currency}
      Plan Start Date: ${formattedStartDate}
      Plan End Date: ${formattedEndDate}
      WHR User Email Id: ${email_id.toLowerCase()}
      Stripe Customer Email Id: ${customerEmail?.toLowerCase()}
      Subscription Id: ${subscriptionId}
    `);
    if (
      paymentStatus === "paid" &&
      sub_expires_at &&
      Date.now() < sub_expires_at * 1000 &&
      plan &&
      totalAmountPaid &&
      currency &&
      formattedStartDate &&
      formattedEndDate &&
      email_id.toLowerCase() === customerEmail?.toLowerCase() &&
      subscriptionId !== undefined
    ) {
      console.log("Payment Module: Data Validated");
      const payload = {
        plan: Number(plan),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        planRenewalDate: formattedEndDate,
        subscriptionId: subscriptionId,
        planFrequency:
          frequency === "monthly"
            ? "MONTHLY"
            : frequency === "yearly"
            ? "ANNUALLY"
            : "",
        planPurchaseValue: totalAmountPaid / 100,
        planPurchaseCurrency: currency?.toUpperCase(),
      };

      updatePlanResponse = await upgradePlan(payload);

      console.log("Payment Module: Completed");
      const res = NextResponse.json({
        status: paymentStatus,
        updatePlan: updatePlanResponse,
      });
      return res;
    }

    console.log("Payment Module: Subscription Data Validation Failed");
    return NextResponse.json(
      { error: "Subscription Validation Failed" },
      { status: 500 }
    );
  } catch (error: any) {
    console.log("Payment Module: Error :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

interface updatePlanType {
  plan: number;
  startDate: string;
  endDate: string;
  planRenewalDate: string;
  subscriptionId: string;
  planFrequency: string;
  planPurchaseValue: number;
  planPurchaseCurrency: string;
}

const upgradePlan = async (data: updatePlanType) => {
  try {
    const fetchToken = await fetch(`${BASE_URL}/me/account/membership-token`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const resp = await fetchToken.json();
    console.log(`Payment Module: Fetch Token | ${BASE_URL}/me/account/membership-token | POST`, resp);

    const token = resp.data.user.token;

    const payload = {
      ...data,
      token: token,
    };

    const updatePlan = await fetch(`${BASE_URL}/me/account/membership/create`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
    });
    const planUpdateResponse = await updatePlan.json();
    console.log(`Payment Module: Update Plan | ${BASE_URL}/me/account/membership/create | PATCH`, payload, planUpdateResponse);
    return planUpdateResponse;
  } catch (e) {
    console.log("Payment Module: Error in upgradePlan():", e);
    return e;
  }
};

const fetchUser = async () => {
  try {
    const fetchUserData = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const resp = await fetchUserData.json();
    console.log(`Payment Module: Fetch User | ${BASE_URL}/me | GET`, resp);

    return resp;
  } catch (e) {
    console.log("Payment Module: Error Fetching User: ", e);
    return e;
  }
};
