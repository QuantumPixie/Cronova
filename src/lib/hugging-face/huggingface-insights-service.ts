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
      const prompt = this.createPrompt(symptoms, journalEntry);
      const response = await this.hf.textGeneration({
        model: 'tiiuae/falcon-7b-instruct',
        inputs: prompt,
        parameters: {
          max_new_tokens: 350,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      return this.parseInsights(response.generated_text || '');
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackInsights();
    }
  }

  private createPrompt(
    symptoms: SymptomFormData,
    journalEntry: JournalFormData
  ): string {
    return `Analyze the following health data and provide a personalized response:

Symptoms:
- Hot Flashes: ${symptoms.hotFlashes}/10
- Night Sweats: ${symptoms.nightSweats}/10
- Mood Swings: ${symptoms.moodSwings}/10
- Sleep Issues: ${symptoms.sleepIssues}/10
- Anxiety: ${symptoms.anxiety}/10
- Fatigue: ${symptoms.fatigue}/10
- Intensity: ${symptoms.intensity}

Journal Entry:
- Mood: ${journalEntry.mood}
- Sleep: ${journalEntry.sleep} hours
- Exercise: ${journalEntry.exercise ? 'Yes' : 'No'}
- Stress: ${journalEntry.stress}/10

Please provide:
1. A correlation between symptoms and lifestyle factors.
2. Identification of potential triggers.
3. Three actionable recommendations.
4. Holistic strategies for managing symptoms effectively.

Use a structured and empathetic tone in your response.`;
  }

  private parseInsights(generatedText: string): {
    content: string;
    recommendations: string[];
    associatedSymptoms: string[];
    source: string;
  } {
    const cleanedText = generatedText.trim();

    return {
      content: cleanedText,
      recommendations: this.extractRecommendations(cleanedText),
      associatedSymptoms: this.extractAssociatedSymptoms(cleanedText),
      source: 'Salesforce XGen AI Insights',
    };
  }

  private extractRecommendations(text: string): string[] {
    const recommendationRegex = /Recommendation\s*\d+:?\s*([^\n]+)/gi;
    const matches = text.matchAll(recommendationRegex);
    return Array.from(matches, (match) => match[1].trim()).slice(0, 3);
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
        'Maintain a consistent sleep schedule.',
        'Practice stress-reduction techniques like meditation.',
        'Consult with your healthcare provider about your symptoms.',
      ],
      associatedSymptoms: ['Mood Changes', 'Sleep Disruption'],
      source: 'Default Insights',
    };
  }
}

export const insightsGenerator = new InsightsGenerator();
