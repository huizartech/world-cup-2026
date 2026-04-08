import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: "World Cup Watch Party <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email send error:", error);
    throw error;
  }

  return data;
}

export function buildGameReminderEmail(gameSummary: string) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a1a2e;">⚽ Game Day Reminder!</h1>
      ${gameSummary}
      <p style="color: #666; font-size: 14px; margin-top: 24px;">
        — World Cup 2026 Watch Party
      </p>
    </div>
  `;
}

export function buildWeeklyAdminEmail(
  weekGames: Array<{
    matchNumber: number;
    homeTeam: string;
    awayTeam: string;
    kickoffTime: Date;
    watchLocation: string | null;
    phoneNumbers: string[];
  }>
) {
  const gameRows = weekGames
    .map((g) => {
      const date = g.kickoffTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      const phones = g.phoneNumbers.length > 0
        ? g.phoneNumbers.join(", ")
        : "No contacts";
      const smsTemplate = `Hey! ${g.homeTeam} vs ${g.awayTeam} is on ${date}${g.watchLocation ? ` at ${g.watchLocation}` : ""}. You in?`;

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <strong>#${g.matchNumber}: ${g.homeTeam} vs ${g.awayTeam}</strong><br>
            <span style="color: #666;">${date}</span><br>
            ${g.watchLocation ? `📍 ${g.watchLocation}<br>` : ""}
            📱 ${phones}<br>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-top: 4px; font-size: 13px;">
              <strong>Text template:</strong> ${smsTemplate}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a1a2e;">📋 Weekly Watch Party Summary</h1>
      <p>${weekGames.length} game(s) this week:</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${gameRows}
      </table>
      <p style="color: #666; font-size: 14px; margin-top: 24px;">
        — World Cup 2026 Watch Party Admin
      </p>
    </div>
  `;
}
