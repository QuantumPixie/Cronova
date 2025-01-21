'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import type { InsightResponse } from '@/types/insights';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  async function fetchInsights() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch insights');
      }

      setInsights(result.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch insights';
      console.error('Insights fetch error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateNewInsight() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights', { method: 'POST' });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate new insight');
      }

      setInsights((prevInsights) => [result.data, ...prevInsights]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate new insight';
      console.error('Insight generation error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto' role='main'>
      <ErrorBoundary>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-[#800020]'>Your Insights</h1>
          <button
            onClick={generateNewInsight}
            disabled={isLoading}
            className='inline-flex items-center px-4 py-2 bg-[#800020] text-[#E3BAB3] rounded hover:bg-[#a36c53] disabled:opacity-50 transition-colors duration-200'
            aria-label='Generate new insight'
            aria-disabled={isLoading}
          >
            <Sparkles className='w-4 h-4 mr-2' aria-hidden='true' />
            {isLoading ? 'Generating...' : 'Generate New Insight'}
          </button>
        </div>

        {error && (
          <div
            className='p-3 text-sm text-red-500 bg-red-100 rounded mb-4'
            role='alert'
            aria-live='polite'
          >
            {error}
          </div>
        )}

        {isLoading && insights.length === 0 && (
          <div
            className='text-center py-12'
            role='status'
            aria-label='Loading insights'
          >
            <div
              className='animate-spin w-8 h-8 border-4 border-[#E3BAB3] border-t-[#800020] rounded-full mx-auto mb-4'
              aria-hidden='true'
            ></div>
            <p className='text-[#4A4A4A]'>Loading insights...</p>
          </div>
        )}

        {!isLoading && insights.length === 0 && (
          <div
            className='text-center py-12 bg-white rounded-lg border border-[#E3BAB3] shadow-sm'
            role='status'
            aria-label='No insights available'
          >
            <Sparkles
              className='w-8 h-8 text-[#800020] mx-auto mb-4'
              aria-hidden='true'
            />
            <p className='text-[#4A4A4A] mb-4'>
              No insights generated yet. Click &quot;Generate New Insight&quot;
              to get personalized recommendations.
            </p>
            <p className='text-[#800020] hover:text-[#a36c53] transition-colors duration-200'>
              Log symptoms to get started
            </p>
          </div>
        )}

        <div className='space-y-4' role='feed' aria-label='Insights list'>
          {insights.map((insight) => (
            <article
              key={insight.id}
              className='bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-6 border border-[#E3BAB3]'
              aria-labelledby={`insight-title-${insight.id}`}
            >
              <div className='flex justify-between items-start mb-4'>
                <p className='text-sm text-[#4A4A4A]'>
                  {new Date(insight.date).toLocaleDateString()}
                </p>
                <span
                  className='text-xs text-[#800020] bg-[#E3BAB3] px-2 py-1 rounded-full'
                  role='note'
                >
                  {insight.source}
                </span>
              </div>

              <p
                id={`insight-title-${insight.id}`}
                className='mb-4 text-[#4A4A4A]'
              >
                {insight.content}
              </p>

              {insight.recommendations.length > 0 && (
                <div
                  className='mb-4'
                  role='region'
                  aria-label='Recommendations'
                >
                  <h3 className='font-semibold text-[#800020] mb-2'>
                    Recommendations:
                  </h3>
                  <ul className='space-y-2' role='list'>
                    {insight.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className='flex items-start text-sm text-[#4A4A4A]'
                      >
                        <Sparkles
                          className='w-4 h-4 text-[#B76E79] mr-2 mt-1 flex-shrink-0'
                          aria-hidden='true'
                        />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {insight.associatedSymptoms.length > 0 && (
                <div role='region' aria-label='Associated symptoms'>
                  <h3 className='font-semibold text-[#800020] mb-2'>
                    Associated Symptoms:
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {insight.associatedSymptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-gradient-to-r from-[#E3BAB3] to-[#B76E79] text-white rounded-full text-xs'
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </ErrorBoundary>
    </div>
  );
}
