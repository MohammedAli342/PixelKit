
import React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  iconSmall: React.ReactNode;
}