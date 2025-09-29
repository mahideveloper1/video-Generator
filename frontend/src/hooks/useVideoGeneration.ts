import { useState, useCallback } from 'react';
import { videoApi } from '@/utils/api';
import { FormData, VideoGenerationResponse } from '@/types';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export const useVideoGeneration = () => {
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false });
  const [result, setResult] = useState<VideoGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = useCallback(async (data: FormData) => {
    try {
      setLoading({ isLoading: true, message: 'Starting video generation...' });
      setError(null);
      setResult(null);

      const response = await videoApi.generateVideo(data);
      
      if (response.success && response.data?.jobId) {
        setResult(response);
        pollStatus(response.data.jobId);
      } else {
        throw new Error(response.error || 'Failed to generate video');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading({ isLoading: false });
    }
  }, []);

  const pollStatus = useCallback(async (jobId: string) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        
        if (attempts > maxAttempts) {
          setError('Video generation timed out. Please try again.');
          setLoading({ isLoading: false });
          return;
        }

        setLoading({ 
          isLoading: true, 
          message: 'Processing video...', 
          progress: Math.min((attempts / maxAttempts) * 100, 90) 
        });

        const response = await videoApi.checkStatus(jobId);
        
        if (response.success && response.data) {
          if (response.data.status === 'completed') {
            setResult(response);
            setLoading({ isLoading: false, message: 'Video generated successfully!' });
            return;
          } else if (response.data.status === 'failed') {
            setError('Video generation failed. Please try again.');
            setLoading({ isLoading: false });
            return;
          }
        }

        // Continue polling
        setTimeout(poll, 5000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Status check failed');
        setLoading({ isLoading: false });
      }
    };

    setTimeout(poll, 2000); // Start polling after 2 seconds
  }, []);

  const reset = useCallback(() => {
    setLoading({ isLoading: false });
    setResult(null);
    setError(null);
  }, []);

  return {
    generateVideo,
    loading,
    result,
    error,
    reset,
  };
};