import "server-only";

/** POST to Telegram with a timeout and one retry. Never throws. */
async function sendTelegram(token: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = JSON.stringify({ chat_id: chatId, text });

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) return;
      // 4xx won't get better on retry — stop.
      if (res.status >= 400 && res.status < 500) {
        console.error("[notify] telegram rejected", res.status);
        return;
      }
    } catch (e) {
      clearTimeout(timer);
      if (attempt === 1) console.error("[notify] telegram failed", e);
    }
  }
}

/**
 * Lead notification to the owner. Telegram Bot API if configured; otherwise a
 * server log. Failures never block the inquiry from being saved.
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
  await sendTelegram(token, chatId, text);
}

/** Notify the owner of a new newsletter subscriber. Never throws. */
export async function notifyNewSubscriber(email: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text = `✉️ Новая подписка на рассылку\nEmail: ${email}`;
  if (!token || !chatId) {
    console.info("[subscriber]", text);
    return;
  }
  await sendTelegram(token, chatId, text);
}
