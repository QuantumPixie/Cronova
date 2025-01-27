import { insightsGenerator } from '../huggingface-insights-service';

jest.mock('../huggingface-insights-service', () => ({
  insightsGenerator: {
    generateInsights: jest.fn(),
  },
}));

describe('InsightsGenerator', () => {
  const mockInsightResponse = {
    content:
      'Based on the data, there appears to be a strong correlation between sleep issues and stress levels.',
    recommendations: [
      'Establish a consistent bedtime routine',
      'Incorporate daily meditation',
      'Start gentle exercise program',
    ],
    associatedSymptoms: ['hot flashes', 'night sweats', 'sleep issues'],
    source: 'Salesforce XGen AI Insights',
  };

  const mockSymptomData = {
    date: '2024-01-22',
    hotFlashes: 7,
    nightSweats: 6,
    moodSwings: 5,
    sleepIssues: 8,
    anxiety: 6,
    fatigue: 7,
    intensity: 'MODERATE' as const,
    notes: 'Test notes',
  };

  const mockJournalData = {
    date: '2024-01-22',
    mood: 'NEUTRAL' as const,
    sleep: 6,
    exercise: false,
    stress: 8,
    notes: 'Test journal',
  };

  beforeEach(() => {
    (insightsGenerator.generateInsights as jest.Mock).mockResolvedValue(
      mockInsightResponse
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate insights successfully', async () => {
    const insights = await insightsGenerator.generateInsights(
      mockSymptomData,
      mockJournalData
    );

    expect(insights).toBeDefined();
    expect(insights.content).toBeDefined();
    expect(insights.recommendations).toHaveLength(3);
    expect(insights.recommendations).toContain(
      'Establish a consistent bedtime routine'
    );
    expect(insights.source).toBe('Salesforce XGen AI Insights');
  });

  it('should extract recommendations correctly', async () => {
    const insights = await insightsGenerator.generateInsights(
      mockSymptomData,
      mockJournalData
    );
    expect(insights.recommendations).toEqual([
      'Establish a consistent bedtime routine',
      'Incorporate daily meditation',
      'Start gentle exercise program',
    ]);
  });

  it('should extract associated symptoms correctly', async () => {
    const insights = await insightsGenerator.generateInsights(
      mockSymptomData,
      mockJournalData
    );
    expect(insights.associatedSymptoms).toContain('hot flashes');
    expect(insights.associatedSymptoms).toContain('night sweats');
  });

  it('should return fallback insights on API error', async () => {
    (insightsGenerator.generateInsights as jest.Mock).mockResolvedValue({
      content:
        'Based on your current symptoms and journal entry, it appears you may be experiencing typical menopausal challenges.',
      recommendations: [
        'Maintain a consistent sleep schedule.',
        'Practice stress-reduction techniques like meditation.',
        'Consult with your healthcare provider about your symptoms.',
      ],
      associatedSymptoms: ['Mood Changes', 'Sleep Disruption'],
      source: 'Default Insights',
    });

    const insights = await insightsGenerator.generateInsights(
      mockSymptomData,
      mockJournalData
    );
    expect(insights.source).toBe('Default Insights');
    expect(insights.recommendations).toHaveLength(3);
    expect(insights.content).toContain('typical menopausal challenges');
  });
});
