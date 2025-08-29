'use client';

import { useApi } from './useApi';
import { dashboardAPI, contactAPI } from '../api';

/**
 * Hook for dashboard statistics
 */
export const useDashboardStats = () => {
  return useApi(dashboardAPI.getStats);
};

/**
 * Hook for contact statistics
 */
export const useContactStats = () => {
  return useApi(contactAPI.getStats);
};

/**
 * Hook for sending contact messages
 */
export const useSendContact = () => {
  return useApi(contactAPI.send, [], false);
};

export default useDashboardStats;