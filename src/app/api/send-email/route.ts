import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { escapeHtml, getEmailTransporter } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(`send-email:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const transporter = getEmailTransporter();
    if (!transporter) {
      console.error("Email service not configured (missing EMAIL_USER or EMAIL_PASS)");
      return NextResponse.json(
        { error: "Email service is temporarily unavailable." },
        { status: 503 }
      );
    }

    const adminEmail = process.env.EMAIL_USER?.trim();

    // Email options
    const mailOptions = {
      from: adminEmail,
      to: adminEmail, // Send to yourself
      replyTo: email.trim(),
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from: ${escapeHtml(email)}</em></p>
      `,
    };

    // Send email with timeout protection
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
