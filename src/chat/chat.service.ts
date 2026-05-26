import { Injectable } from '@nestjs/common';

export type ChatIntent =
  | 'general_chat'
  | 'document_summary'
  | 'pdv_message'
  | 'code_help';

@Injectable()
export class ChatService {
  getMockReply(message: string): { reply: string; intent: ChatIntent } {
    const normalizedMessage = this.normalizeText(message);

    if (this.containsAny(normalizedMessage, ['pdf', 'documento', 'archivo'])) {
      return {
        intent: 'document_summary',
        reply:
          'Entiendo que quieres trabajar con un documento. Pronto podré leer PDFs y generar resúmenes detallados.',
      };
    }

    if (
      this.containsAny(normalizedMessage, [
        'pdv',
        'ac',
        'bc',
        'reporte',
        'whatsapp',
      ])
    ) {
      return {
        intent: 'pdv_message',
        reply:
          'Detecté que quieres preparar un mensaje PDV. Más adelante usaré tus formatos guardados para generar el texto listo para WhatsApp.',
      };
    }

    if (
      this.containsAny(normalizedMessage, [
        'codigo',
        'error',
        'bug',
        'programacion',
      ])
    ) {
      return {
        intent: 'code_help',
        reply:
          'Parece que quieres revisar código o resolver un error. Puedo ayudarte a analizarlo paso a paso.',
      };
    }

    return {
      intent: 'general_chat',
      reply: 'Hola David, te escucho. Estoy listo para ayudarte.',
    };
  }

  private containsAny(message: string, words: string[]): boolean {
    return words.some((word) => message.includes(word));
  }

  private normalizeText(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
