'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
};
