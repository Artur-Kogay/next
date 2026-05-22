export const authKeys = {
  all: ['auth'] as const,
  smsServices: () => [...authKeys.all, 'sms-services'] as const,
};
