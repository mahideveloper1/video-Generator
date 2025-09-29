export const validateName = (name: string): string | null => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return 'Phone number is required';
  if (!/^\d{10,15}$/.test(phone.replace(/\s/g, ''))) return 'Please enter a valid phone number';
  return null;
};

export const validateCountry = (country: string): string | null => {
  if (!country) return 'Please select a country';
  return null;
};