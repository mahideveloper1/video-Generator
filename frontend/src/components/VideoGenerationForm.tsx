'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { countries } from '@/utils/countries';
import { validateName, validatePhone, validateCountry } from '@/utils/validation';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { FormData } from '@/types';

export const VideoGenerationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    country: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const { generateVideo, loading, result, error, reset } = useVideoGeneration();

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof FormData, value: string) => {
    let error: string | null = null;

    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'country':
        error = validateCountry(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error || undefined }));
    return !error;
  };

  const validateForm = () => {
    const nameValid = validateField('name', formData.name);
    const phoneValid = validateField('phone', formData.phone);
    const countryValid = validateField('country', formData.country);

    setTouched({ name: true, phone: true, country: true });
    return nameValid && phoneValid && countryValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await generateVideo({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      country: formData.country,
    });
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', country: '' });
    setErrors({});
    setTouched({});
    reset();
  };

  const countryOptions = countries.map(country => ({
    value: country.code,
    label: `${country.name} (${country.dialCode})`,
  }));

  const isFormValid = 
    !Object.values(errors).some(error => error) &&
    Object.values(formData).every(value => value.trim());

  if (result && result.success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            Success!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">
            Your personalized video has been generated and sent to your WhatsApp!
          </p>
          <Button onClick={handleReset} variant="secondary">
            Generate Another Video
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Generate Personalized Video
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={touched.name ? errors.name : undefined}
            placeholder="Enter your full name"
            disabled={loading.isLoading}
            required
          />

          <Select
            label="Country"
            value={formData.country}
            onChange={handleChange('country')}
            onBlur={handleBlur('country')}
            error={touched.country ? errors.country : undefined}
            options={countryOptions}
            disabled={loading.isLoading}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={touched.phone ? errors.phone : undefined}
            placeholder="1234567890"
            disabled={loading.isLoading}
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {loading.isLoading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600">{loading.message}</p>
              {loading.progress && (
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loading.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading.isLoading}
            disabled={!isFormValid || loading.isLoading}
          >
            Generate Video
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <p>Your personalized video will be sent to your WhatsApp number.</p>
            <p className="mt-1">Processing typically takes 2-5 minutes.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
