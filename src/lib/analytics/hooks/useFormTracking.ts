'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../providers/AnalyticsProvider';
import { trackFormStart, trackFormSubmit, trackFormAbandon } from '../core';
import { updateSessionActivity } from '../journey/sessionManager';

interface FormState {
  formElement: HTMLFormElement;
  formId: string;
  formName: string;
  startTime: number;
  interactedFields: Set<string>;
  totalFields: number;
  hasStarted: boolean;
  hasSubmitted: boolean;
}

/**
 * Hook to automatically track form interactions
 * Tracks: form starts, submissions, abandonments
 * Uses MutationObserver to detect dynamically added forms
 * Privacy-safe: never captures actual form values
 */
export const useFormTracking = () => {
  const pathname = usePathname();
  const { isEnabled, config } = useAnalytics();
  const trackedForms = useRef<Map<HTMLFormElement, FormState>>(new Map());

  useEffect(() => {
    if (!isEnabled || !config.trackForms) return;

    // Get form identifier
    const getFormId = (form: HTMLFormElement): string => {
      return form.id || form.name || form.getAttribute('data-form-id') || 'unknown';
    };

    // Get form name for display
    const getFormName = (form: HTMLFormElement): string => {
      return (
        form.getAttribute('data-form-name') ||
        form.name ||
        form.id ||
        form.getAttribute('aria-label') ||
        'Unknown Form'
      );
    };

    // Count form fields
    const countFormFields = (form: HTMLFormElement): number => {
      const inputs = form.querySelectorAll('input, textarea, select');
      // Filter out hidden, submit, and button inputs
      return Array.from(inputs).filter((input) => {
        const type = input.getAttribute('type');
        return type !== 'hidden' && type !== 'submit' && type !== 'button';
      }).length;
    };

    // Handle form field interaction
    const handleFieldInteraction = (event: Event) => {
      const field = event.target as HTMLInputElement;
      const form = field.closest('form');
      if (!form) return;

      const formState = trackedForms.current.get(form);
      if (!formState) return;

      // Update session activity
      updateSessionActivity();

      // Track form start on first interaction
      if (!formState.hasStarted) {
        formState.hasStarted = true;
        trackFormStart(formState.formId, formState.formName);
      }

      // Track interacted field
      const fieldName = field.name || field.id || 'unknown';
      formState.interactedFields.add(fieldName);
    };

    // Handle form submission
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      const formState = trackedForms.current.get(form);
      if (!formState) return;

      formState.hasSubmitted = true;

      // Track successful submission
      trackFormSubmit(formState.formId, formState.formName, true);

      // Update session activity
      updateSessionActivity();
    };

    // Track form abandonment on page unload
    const trackAbandonments = () => {
      trackedForms.current.forEach((formState) => {
        // Only track abandonment if user started but didn't submit
        if (formState.hasStarted && !formState.hasSubmitted) {
          const now = Date.now();
          const timeSpent = Math.round((now - formState.startTime) / 1000);
          const completionPercentage = Math.round(
            (formState.interactedFields.size / formState.totalFields) * 100
          );

          trackFormAbandon(
            formState.formId,
            Array.from(formState.interactedFields).join(', '),
            completionPercentage,
            timeSpent
          );
        }
      });
    };

    // Initialize tracking for a form
    const initFormTracking = (form: HTMLFormElement) => {
      // Skip if already tracking
      if (trackedForms.current.has(form)) return;

      // Skip if form has data-track-ignore
      if (form.hasAttribute('data-track-ignore')) return;

      const formId = getFormId(form);
      const formName = getFormName(form);
      const totalFields = countFormFields(form);

      // Create form state
      const formState: FormState = {
        formElement: form,
        formId,
        formName,
        startTime: Date.now(),
        interactedFields: new Set(),
        totalFields,
        hasStarted: false,
        hasSubmitted: false,
      };

      trackedForms.current.set(form, formState);

      // Add field interaction listeners
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach((field) => {
        field.addEventListener('focus', handleFieldInteraction);
        field.addEventListener('input', handleFieldInteraction);
      });

      // Add submit listener
      form.addEventListener('submit', handleFormSubmit);
    };

    // Initialize tracking for all existing forms
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => initFormTracking(form as HTMLFormElement));

    // Watch for dynamically added forms
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;

            // Check if the node itself is a form
            if (element.tagName === 'FORM') {
              initFormTracking(element as HTMLFormElement);
            }

            // Check for forms within the added node
            const nestedForms = element.querySelectorAll('form');
            nestedForms.forEach((form) => initFormTracking(form as HTMLFormElement));
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Track abandonments on page unload
    window.addEventListener('beforeunload', trackAbandonments);

    // Cleanup
    return () => {
      trackAbandonments();
      observer.disconnect();
      window.removeEventListener('beforeunload', trackAbandonments);

      // Remove event listeners from tracked forms
      trackedForms.current.forEach((formState) => {
        const fields = formState.formElement.querySelectorAll('input, textarea, select');
        fields.forEach((field) => {
          field.removeEventListener('focus', handleFieldInteraction);
          field.removeEventListener('input', handleFieldInteraction);
        });
        formState.formElement.removeEventListener('submit', handleFormSubmit);
      });

      trackedForms.current.clear();
    };
  }, [pathname, isEnabled, config]);
};
