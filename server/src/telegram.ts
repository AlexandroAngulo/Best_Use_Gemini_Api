import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

// In-memory store for Demo (In production use Supabase/Database)
let currentChatId: string | number | null = null;

export function initTelegramBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN no configurado. Las notificaciones estarán desactivadas.');
    return;
  }

  bot.start((ctx) => {
    currentChatId = ctx.chat.id;
    ctx.reply('¡Bienvenido al Asistente de Desarrollo! He registrado tu Chat ID para enviarte sugerencias de código en tiempo real.');
    console.log(`Telegram Chat ID registrado: ${currentChatId}`);
  });

  bot.launch().then(() => {
    console.log('Bot de Telegram iniciado y listo.');
  }).catch((err) => {
    console.error('Error al iniciar bot de Telegram:', err);
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

export async function sendTelegramNotification(message: string) {
  if (!currentChatId) {
    console.warn('No hay Chat ID registrado. Envía /start al bot en Telegram.');
    return false;
  }

  try {
    await bot.telegram.sendMessage(currentChatId, message, { parse_mode: 'Markdown' });
    return true;
  } catch (error) {
    console.error('Error enviando notificación a Telegram:', error);
    return false;
  }
}
