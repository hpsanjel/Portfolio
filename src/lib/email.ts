import dns from "node:dns";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { formatTimeLabel } from "@/lib/booking";

// Prefer IPv4 for outbound network connections to avoid hanging on Linux VPS servers
// that have misconfigured or unrouted IPv6 interfaces.
if (typeof dns.setDefaultResultOrder === "function") {
	dns.setDefaultResultOrder("ipv4first");
}

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function getEmailTransporter() {
	const user = process.env.EMAIL_USER?.trim();
	// Google App Passwords often contain spaces (e.g. "xxxx xxxx xxxx xxxx"); strip them to avoid parser/auth errors
	const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

	if (!user || !pass) {
		console.warn("EMAIL_USER or EMAIL_PASS environment variable is missing. Outbound email is disabled.");
		return null;
	}

	// Support custom SMTP host/port override (e.g. if the VPS host blocks port 465)
	if (process.env.SMTP_HOST) {
		const port = Number(process.env.SMTP_PORT) || 587;
		const options: SMTPTransport.Options = {
			host: process.env.SMTP_HOST,
			port,
			secure: process.env.SMTP_SECURE === "true" || port === 465,
			auth: { user, pass },
			dnsTimeout: 5000,
			connectionTimeout: 8000,
			greetingTimeout: 8000,
			socketTimeout: 10000,
		};
		return nodemailer.createTransport(options);
	}

	const options: SMTPTransport.Options = {
		service: "gmail",
		auth: { user, pass },
		dnsTimeout: 5000,
		connectionTimeout: 8000,
		greetingTimeout: 8000,
		socketTimeout: 10000,
	};
	return nodemailer.createTransport(options);
}

export interface BookingEmailPayload {
	date: string;
	time: string;
	name: string;
	email: string;
	phone: string;
	message?: string;
}

export async function sendBookingEmails({ date, time, name, email, phone, message }: BookingEmailPayload) {
	const transporter = getEmailTransporter();
	if (!transporter) {
		console.warn("Skipping booking confirmation emails because email transporter is not configured.");
		return;
	}

	const fromEmail = process.env.EMAIL_USER?.trim();
	const formattedTime = formatTimeLabel(time);

	const results = await Promise.allSettled([
		transporter.sendMail({
			from: fromEmail,
			to: fromEmail,
			subject: `New meeting booking: ${date} at ${formattedTime}`,
			html: `
				<h3>New Meeting Booking</h3>
				<p><strong>Date:</strong> ${escapeHtml(date)}</p>
				<p><strong>Time:</strong> ${escapeHtml(formattedTime)}</p>
				<p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
				<p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
				<p><strong>Phone:</strong> ${escapeHtml(phone.trim())}</p>
				${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>` : ""}
			`,
		}),
		transporter.sendMail({
			from: fromEmail,
			to: email.trim(),
			subject: `Booking confirmed: ${date} at ${formattedTime}`,
			html: `
				<h3>Your meeting is confirmed</h3>
				<p>Hi ${escapeHtml(name.trim())},</p>
				<p>Thanks for booking a meeting. Here are the details:</p>
				<p><strong>Date:</strong> ${escapeHtml(date)}</p>
				<p><strong>Time:</strong> ${escapeHtml(formattedTime)}</p>
				${message ? `<p><strong>Your message:</strong></p><p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>` : ""}
				<p>If you need to reschedule or cancel, just reply to this email.</p>
				<p>Looking forward to speaking with you!</p>
			`,
		}),
	]);

	for (const [i, result] of results.entries()) {
		if (result.status === "rejected") {
			const recipient = i === 0 ? "admin" : "visitor";
			console.error(`Booking was saved but the ${recipient} notification email failed to send:`, result.reason);
		}
	}
}
