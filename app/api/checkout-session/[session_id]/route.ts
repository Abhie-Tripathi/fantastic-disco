import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { format, fromUnixTime, addDays, addYears } from "date-fns";
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
      expand: ["subscription", "customer", "invoice.payment_intent"],
    });

    const email_id = userDetail.data?.email;
    const customerEmail = session.customer_details?.email;
    const sub_expires_at = session.expires_at;
    const plan = session.metadata?.plan;
    const frequency = session.metadata?.planFrequency;
    const currency = session.currency;
    const totalAmountPaid = session.amount_total;
    const paymentStatus = session.payment_status;

    const startDate = fromUnixTime(session.created);

    let endDate = startDate;
    if (frequency === "yearly") {
      endDate = addYears(startDate, 1);
    } else if (frequency === "monthly") {
      endDate = addDays(startDate, 30);
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    let updatePlanResponse = {};
    if (
      paymentStatus === "paid" &&
      sub_expires_at &&
      Date.now() < sub_expires_at * 1000 &&
      plan &&
      formattedStartDate &&
      formattedEndDate &&
      email_id === customerEmail
    ) {
      // const updatedPayload = {
      //   "planStartDate": startDate,
      //   "planEndDate": endDate, // -- or change interval as per plan duration
      //   "purchaseValue": totalAmountPaid, // -- replace with actual value if needed
      //   "currency": currency, // -- replace with actual currency
      //   "updatedAt": new Date().toISOString(), // CURRENT_TIMESTAMP
      //   "pendingRequests": '200', // essential or scale - 200, advacne - 1000
      //   "pendingCompanySearchRequests": '200' // essential or scale - 200, advanced-1000
      // }

      updatePlanResponse = await upgradePlan(
        plan,
        formattedStartDate,
        formattedEndDate
      );
    }

    const res = NextResponse.json({
      stripe: session,
      updatePlan: updatePlanResponse,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const upgradePlan = async (
  plan: number | string,
  startDate: string,
  endDate: string
) => {
  try {
    const fetchToken = await fetch(`${BASE_URL}/me/account/membership`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const resp = await fetchToken.json();

    const token = resp.data.user.token;

    const payload = {
      plan: Number(plan),
      token: token,
      startDate: startDate,
      endDate: endDate,
    };

    const updatePlan = await fetch(`${BASE_URL}/me/account/membership`, {
      method: "PUT",
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
