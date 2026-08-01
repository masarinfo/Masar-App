import { Injectable, Logger } from '@nestjs/common';

export interface AiGenerateDto {
  prompt: string;
  context?: string;
  type?: 'summarize' | 'expand' | 'rewrite' | 'translate_ar' | 'translate_en' | 'freeform' | 'table';
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  /**
   * Generates text using OpenAI API if available, otherwise falls back to simulated response.
   */
  async generateText(dto: AiGenerateDto): Promise<{ text: string }> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        return await this.generateWithOpenAI(dto, apiKey);
      } catch (error) {
        this.logger.error('OpenAI API call failed, falling back to simulation', error);
        return this.generateSimulated(dto);
      }
    }

    return this.generateSimulated(dto);
  }

  private async generateWithOpenAI(dto: AiGenerateDto, apiKey: string): Promise<{ text: string }> {
    const { prompt, context, type } = dto;
    let userMessage = '';

    if (type === 'summarize') {
      userMessage = `قم بتلخيص النص التالي:\n\n${context || prompt}`;
    } else if (type === 'expand') {
      userMessage = `قم بتوسيع النص التالي وإضافة تفاصيل مفيدة:\n\n${context || prompt}`;
    } else if (type === 'rewrite') {
      userMessage = `أعد صياغة النص التالي بأسلوب احترافي:\n\n${context || prompt}`;
    } else if (type === 'translate_ar') {
      userMessage = `ترجم النص التالي إلى اللغة العربية الفصحى:\n\n${context || prompt}`;
    } else if (type === 'translate_en') {
      userMessage = `ترجم النص التالي إلى اللغة الإنجليزية:\n\n${context || prompt}`;
    } else if (type === 'table') {
      userMessage = `حول النص التالي إلى جدول منظم:\n\n${context || prompt}`;
    } else {
      userMessage = context ? `السياق:\n${context}\n\nالطلب: ${prompt}` : prompt;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'أنت مساعد كتابة عربي ذكي. ساعد المستخدم في كتابة محتوى عربي احترافي.' },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.choices[0].message.content };
  }

  private async generateSimulated(dto: AiGenerateDto): Promise<{ text: string }> {
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
    } else if (type === 'table') {
      generatedText = `| العنصر | الوصف |\n|---|---|\n| 1 | بيانات تجريبية 1 |\n| 2 | بيانات تجريبية 2 |`;
    } else {
      // Freeform prompt
      generatedText = `(إجابة ذكية لـ "${prompt}"): هذا مثال على قدرة المساعد الذكي على توليد نصوص إبداعية استجابة لأوامرك. يمكننا دمج واجهة برمجة التطبيقات (API) الخاصة بـ OpenAI هنا مستقبلاً ليصبح المحرك قادراً على كتابة المقالات، الأكواد، وتحليل البيانات.`;
    }

    return { text: generatedText };
  }
}
