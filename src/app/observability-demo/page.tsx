'use client';

import React, { useState, useEffect } from 'react';
import { DemoView } from '@/components/demo/DemoView';

export default function ObservabilityDemoPage() {
  const [providerReady, setProviderReady] = useState(false);

  // Render the Kanban panel once mounted on the client.
  useEffect(() => {
    setProviderReady(true);
  }, []);

  return (
    <DemoView
      isOpen={true}
      onClose={() => {}}
      providerReady={providerReady}
    />
  );
}
