import { HfInference } from '@huggingface/inference';
import type { SymptomFormData } from '@/types/symptoms';
import type { JournalFormData } from '@/types/journal';

export class InsightsGenerator {
  private hf: HfInference;

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('Hugging Face API token is not configured');
    }
    this.hf = new HfInference(apiKey);
  }

  async generateInsights(
    symptoms: SymptomFormData,
    journalEntry: JournalFormData
  ): Promise<{
    content: string;
    recommendations: string[];
    associatedSymptoms: string[];
    source: string;
  }> {
    try {
      const prompt = this.createDetailedInsightPrompt(symptoms, journalEntry);
      const response = await this.hf.textGeneration({
        model: 'tiiuae/falcon-7b-instruct',
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      console.log('Generated text:', response.generated_text);

      return this.parseInsights(response.generated_text || '');
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackInsights();
    }
  }

  private createDetailedInsightPrompt(
    symptoms: SymptomFormData,
    journalEntry: JournalFormData
  ): string {
    return `
Based on the provided health data, generate a personalized and actionable insight, considering the user's symptoms and lifestyle context.

### Symptoms
- Hot Flashes: ${symptoms.hotFlashes}/10 (e.g., mild, moderate, severe)
- Night Sweats: ${symptoms.nightSweats}/10
- Mood Swings: ${symptoms.moodSwings}/10
- Sleep Issues: ${symptoms.sleepIssues}/10
- Anxiety: ${symptoms.anxiety}/10
- Fatigue: ${symptoms.fatigue}/10
- Symptom Intensity: ${symptoms.intensity}
- Date: ${symptoms.date}

### Journal Entry
- Mood: ${journalEntry.mood}
- Sleep Duration: ${journalEntry.sleep} hours
- Physical Activity: ${journalEntry.exercise ? 'Active' : 'Sedentary'}
- Stress Level: ${journalEntry.stress}/10
- Date: ${journalEntry.date}

### Instructions
1. Insights: Analyze the correlation between the symptoms and lifestyle data. Highlight how certain habits or triggers might influence the severity of symptoms.
2. Triggers: Identify potential symptom triggers based on the data provided.
3. Recommendations: Provide 3 actionable and specific recommendations for managing these symptoms. Tailor them to the user's reported severity and lifestyle.
4. Holistic Management Strategies: Suggest broader lifestyle adjustments for long-term symptom relief.
5. Tone: Use an empathetic, conversational tone while maintaining a concise format.

Format your response clearly and concisely with headings for each section. Avoid unnecessary verbosity.
    `.trim();
  }

  private parseInsights(generatedText: string): {
    content: string;
    recommendations: string[];
    associatedSymptoms: string[];
    source: string;
  } {
    const insightRegex = /### Insights[\s\S]*?(?=###|$)/i;
    const recommendationRegex = /### Recommendations[\s\S]*?(?=###|$)/i;
    const holisticRegex =
      /### Holistic Management Strategies[\s\S]*?(?=###|$)/i;

    console.log('Parsing generated text:', generatedText);

    const insightsContent =
      generatedText.match(insightRegex)?.[0]?.trim() || '';
    console.log('Extracted Insights:', insightsContent);
    const holisticContent =
      generatedText.match(holisticRegex)?.[0]?.trim() || '';
    console.log('Extracted Holistic Content:', holisticContent);

    const content = `${insightsContent}\n\n${holisticContent}`;

    const recommendations = this.extractRecommendations(
      generatedText.match(recommendationRegex)?.[0] || ''
    );

    return {
      content: content,
      recommendations: recommendations,
      associatedSymptoms: this.extractAssociatedSymptoms(generatedText),
      source: 'HuggingFace AI Insights',
    };
  }

  private extractRecommendations(text: string): string[] {
    const recommendationRegex = /(?:\d+\.|Recommendation):\s*(.+)/g;
    const matches = Array.from(text.matchAll(recommendationRegex));
    return matches.map((match) => match[1].trim());
  }

  private extractAssociatedSymptoms(text: string): string[] {
    const symptomKeywords = [
      'hot flashes',
      'night sweats',
      'mood swings',
      'sleep issues',
      'anxiety',
      'fatigue',
      'stress',
      'hormonal changes',
    ];

    return symptomKeywords.filter((symptom) =>
      text.toLowerCase().includes(symptom)
    );
  }

  private getFallbackInsights() {
    return {
      content:
        'Based on your current symptoms and journal entry, it appears you may be experiencing typical menopausal challenges.',
      recommendations: [
        'Maintain a consistent sleep schedule',
        'Practice stress-reduction techniques like meditation',
        'Consult with your healthcare provider about your symptoms',
      ],
      associatedSymptoms: ['Mood Changes', 'Sleep Disruption'],
      source: 'CroNova Default Insights',
    };
  }
}

export const insightsGenerator = new InsightsGenerator();
