import "server-only";

/**
 * Lead notification to the owner. Telegram Bot API if configured; otherwise a
 * server log (phase 4 wires email/Telegram fully). Failures never block the
 * inquiry from being saved.
 */
export async function notifyNewInquiry(lead: {
  name: string;
  contact: string;
  item?: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text =
    `🟢 Новая заявка\n` +
    `Имя: ${lead.name}\n` +
    `Контакт: ${lead.contact}\n` +
    (lead.item ? `Предмет: ${lead.item}` : "Общий запрос");

  if (!token || !chatId) {
    console.info("[inquiry]", text);
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (e) {
    console.error("[inquiry] telegram notify failed", e);
  }
}
