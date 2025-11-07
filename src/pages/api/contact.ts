export const prerender = false; // ensure this runs at request-time, not build-time

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const TO_EMAIL = "hello@timberlinecodeforge.com";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const name = (formData.get("name")?.toString() ?? "").trim();
  const email = (formData.get("email")?.toString() ?? "").trim();
  const company = (formData.get("company")?.toString() ?? "").trim();
  const message = (formData.get("message")?.toString() ?? "").trim();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Missing required fields." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const subject =
    "New Timberline inquiry from " +
    name +
    (company ? ` @ ${company}` : "");

  const bodyText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization: ${company || "—"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await resend.emails.send({
      from: "Timberline Contact <contact@timberlinecodeforge.com>", // must be verified in Resend
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      text: bodyText,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending contact email", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
