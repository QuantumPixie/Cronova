'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { InsightResponse } from '@/types/insights';

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
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Your Insights</h1>
        <button
          onClick={generateNewInsight}
          disabled={isLoading}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {isLoading ? 'Generating...' : 'Generate New Insight'}
        </button>
      </div>

      {error && (
        <div className='p-3 text-sm text-red-500 bg-red-100 rounded mb-4'>
          {error}
        </div>
      )}

      {isLoading && insights.length === 0 && (
        <p className='text-center text-gray-500'>Loading insights...</p>
      )}

      {!isLoading && insights.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500 mb-4'>
            No insights generated yet. Click &quot;Generate New Insight&quot; to
            get personalized recommendations.
          </p>
          <Link
            href='/dashboard/symptoms/new'
            className='text-blue-600 hover:underline'
          >
            Log symptoms to get started
          </Link>
        </div>
      )}

      <div className='space-y-4'>
        {insights.map((insight) => (
          <div
            key={insight.id}
            className='bg-white shadow rounded-lg p-6 border'
          >
            <div className='flex justify-between items-start mb-4'>
              <p className='text-sm text-gray-500'>
                {new Date(insight.date).toLocaleDateString()}
              </p>
              <span className='text-xs text-gray-500'>
                Source: {insight.source}
              </span>
            </div>

            <p className='mb-4'>{insight.content}</p>

            {insight.recommendations.length > 0 && (
              <div className='mb-4'>
                <h3 className='font-semibold mb-2'>Recommendations:</h3>
                <ul className='list-disc list-inside'>
                  {insight.recommendations.map((rec, index) => (
                    <li key={index} className='text-sm'>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insight.associatedSymptoms.length > 0 && (
              <div>
                <h3 className='font-semibold mb-2'>Associated Symptoms:</h3>
                <div className='flex flex-wrap gap-2'>
                  {insight.associatedSymptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
