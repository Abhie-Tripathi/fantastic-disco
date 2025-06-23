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
    const email_id = req.nextUrl.searchParams.get("email_id");
    console.log("email_id", email_id);

    const session = await stripe.checkout.sessions.retrieve(params.session_id, {
      expand: ["subscription", "customer", "invoice.payment_intent"],
    });

    const customerEmail = session.customer_details?.email;
    const sub_expires_at = session.expires_at;
    const plan = session.metadata?.plan;
    const frequency = session.metadata?.planFrequency;

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
      sub_expires_at &&
      Date.now() < (sub_expires_at * 1000) &&
      plan &&
      formattedStartDate &&
      formattedEndDate &&
      email_id === customerEmail
    )
      updatePlanResponse = await upgradePlan(
        plan,
        formattedStartDate,
        formattedEndDate
      );

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

    const payload = JSON.stringify({
      plan: Number(plan),
      token: token,
      startDate: startDate,
      endDate: endDate,
    });

    const updatePlan = await fetch(`${BASE_URL}/me/account/membership`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: payload,
    });
    const planUpdateResponse = await updatePlan.json();
    return planUpdateResponse;
  } catch (e) {
    console.log("Error Updating Plan:", e);
    return e;
  }
};
