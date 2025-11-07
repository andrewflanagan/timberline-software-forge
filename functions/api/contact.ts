// functions/api/contact.ts
import { Resend } from "resend";

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  const formData = await request.formData();
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const company = (formData.get("company") || "").toString().trim();
  const message = (formData.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const subject =
    "New Timberline inquiry from " +
    name +
    (company ? ` @ ${company}` : "");

  const textBody = [
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
      to: ["hello@timberlinecodeforge.com"],                        // where you receive it
      replyTo: email,
      subject,
      text: textBody,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending contact email", error);
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
