export const cleanPhoneHref = (phone?: string | null) =>
  (phone || '').replace(/[\s().-]/g, '');

export const digitsOnly = (value?: string | null) => (value || '').replace(/[^0-9]/g, '');

export const whatsappHref = (number?: string | null, message?: string | null) => {
  const normalized = digitsOnly(number);
  if (!normalized) return '';

  const text = message || '';
  return text ? `https://wa.me/${normalized}?text=${encodeURIComponent(text)}` : `https://wa.me/${normalized}`;
};

