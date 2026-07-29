import { Injectable } from '@nestjs/common';

export interface AiGenerateDto {
  prompt: string;
  context?: string;
  type?: 'summarize' | 'expand' | 'rewrite' | 'translate_ar' | 'translate_en' | 'freeform';
}

@Injectable()
export class AiService {
  /**
   * Simulates AI text generation. In a real environment, this would call OpenAI/Anthropic APIs.
   * Includes an artificial delay to simulate network latency and model inference time.
   */
  async generateText(dto: AiGenerateDto): Promise<{ text: string }> {
    // Simulate network delay (1.5 - 2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const { prompt, context, type } = dto;
    let generatedText = '';

    if (type === 'summarize') {
      generatedText = `(موجز ذكي): لقد تم تلخيص النص بناءً على طلبك. النص الأصلي كان يتحدث عن عدة نقاط رئيسية، وأهم ما يمكن استخلاصه هو أن الفكرة المحورية تدور حول تحسين وتطوير الأداء.`;
    } else if (type === 'expand') {
      generatedText = `(توسيع النص): ${context || ''} بالإضافة إلى ذلك، يجب أن نأخذ في الاعتبار العديد من العوامل الأخرى التي تؤثر على هذا السياق، مثل التطور التقني السريع، واحتياجات السوق المتغيرة، وضرورة التكيف مع بيئة العمل الحديثة لضمان تحقيق أفضل النتائج الممكنة.`;
    } else if (type === 'rewrite') {
      generatedText = `(إعادة صياغة): ${context ? `بصيغة أخرى، يمكننا القول إن: "${context}" يتطلب التركيز على الاستراتيجيات المتقدمة.` : 'يرجى تحديد نص لإعادة صياغته.'}`;
    } else if (type === 'translate_ar') {
      generatedText = `(ترجمة للعربية): النص المترجم سيكون هنا. هذه الأداة تدعم تحويل أي نص إنجليزي إلى لغة عربية فصحى وبليغة.`;
    } else if (type === 'translate_en') {
      generatedText = `(Translated to English): The translated text will appear here. This tool supports converting any Arabic text into fluent English.`;
    } else {
      // Freeform prompt
      generatedText = `(إجابة ذكية لـ "${prompt}"): هذا مثال على قدرة المساعد الذكي على توليد نصوص إبداعية استجابة لأوامرك. يمكننا دمج واجهة برمجة التطبيقات (API) الخاصة بـ OpenAI هنا مستقبلاً ليصبح المحرك قادراً على كتابة المقالات، الأكواد، وتحليل البيانات.`;
    }

    return { text: generatedText };
  }
}
