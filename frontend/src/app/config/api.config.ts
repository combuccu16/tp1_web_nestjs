export const API_URL = 'https://apilb.tridevs.net/api';

export const API_ENDPOINTS = {
  personnes: `${API_URL}/personnes`,
  login: `${API_URL}/Users/login`,
} as const;
