import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/* ─── helpers ─────────────────────────────────────────────────── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\-\s().0-9]{7,20}$/;

function isValidEmail(v: string) {
  return emailRegex.test(v.trim());
}
function isValidPhone(v: string) {
  return phoneRegex.test(v.trim());
}

/* ─── POST /api/contact ────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    /* ── Server-side validation ── */
    const errors: Record<string, string> = {};

    if (!name?.trim() || name.trim().length < 2)
      errors.name = "Full name must be at least 2 characters.";

    if (!email?.trim() || !isValidEmail(email))
      errors.email = "Please provide a valid email address.";

    if (!phone?.trim() || !isValidPhone(phone))
      errors.phone =
        "Phone number must be 7–20 characters and contain only digits, spaces, +, -, (, ).";

    if (!message?.trim() || message.trim().length < 10)
      errors.message = "Message must be at least 10 characters.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    /* ── Send email via Resend ── */
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    const fromAddress =
      process.env.RESEND_FROM_EMAIL ?? "Nox AI <onboarding@Nox7.ai>";

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: ["Moealy1@outlook.com"],
      subject: `New Contact Form Submission from ${name!.trim()}`,
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; background: #0d0d14; color: #f0f0f5; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%); padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: -0.02em;">
              New Contact Form Submission
            </h1>
            <p style="margin: 6px 0 0; font-size: 0.875rem; color: rgba(255,255,255,0.75);">
              Received via NoxAI.com contact form
            </p>
          </div>

          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); width: 140px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(167,139,250,0.8);">
                  Full Name
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; color: #f0f0f5;">
                  ${name!.trim()}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(167,139,250,0.8);">
                  Email
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; color: #f0f0f5;">
                  <a href="mailto:${email!.trim()}" style="color: #a78bfa; text-decoration: none;">${email!.trim()}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(167,139,250,0.8);">
                  Phone
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; color: #f0f0f5;">
                  ${phone!.trim()}
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0 0; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(167,139,250,0.8); vertical-align: top;">
                  Message
                </td>
                <td style="padding: 16px 0 0; font-size: 0.95rem; color: #f0f0f5; line-height: 1.7; white-space: pre-wrap;">
                  ${message!.trim()}
                </td>
              </tr>
            </table>
          </div>

          <div style="padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.75rem; color: rgba(240,240,245,0.35);">
            Sent automatically by the NoxAI contact form.
          </div>
        </div>
      `,
    });

    if (sendError) {
      /* Log full Resend error details for diagnosis */
      console.error("[contact] Resend error name:", (sendError as { name?: string }).name);
      console.error("[contact] Resend error message:", (sendError as { message?: string }).message);
      console.error("[contact] Resend error statusCode:", (sendError as { statusCode?: number }).statusCode);
      console.error("[contact] Resend error full:", JSON.stringify(sendError));
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 502 }
      );
    }

    console.log("[contact] Email sent successfully, id:", sendData?.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
