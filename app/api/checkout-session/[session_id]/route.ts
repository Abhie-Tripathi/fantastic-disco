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
  cookieHeader = req.headers.get("cookie") || "";

  try {
    const userDetail = await fetchUser();

    if (!userDetail.data) {
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
    if (
      paymentStatus === "paid" &&
      sub_expires_at &&
      Date.now() < sub_expires_at * 1000 &&
      plan &&
      totalAmountPaid &&
      currency &&
      formattedStartDate &&
      formattedEndDate &&
      email_id === customerEmail &&
      subscriptionId !== undefined
    ) {
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

      const res = NextResponse.json({
        status: paymentStatus,
        updatePlan: updatePlanResponse,
      });
      return res;
    }

    return NextResponse.json(
      { error: "Subscription Validation Failed" },
      { status: 500 }
    );
  } catch (error: any) {
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
    return planUpdateResponse;
  } catch (e) {
    console.log("Error Updating Plan:", e);
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

    return resp;
  } catch (e) {
    console.log("Error Fetching User:", e);
    return e;
  }
};
