import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface LogToEventDecompositionProps {
  isMobile?: boolean;
}

interface LogVariable {
  key: string;
  value: string;
  placeholder: string;
  color: string;
}

interface LogExample {
  id: number;
  fullLog: string;
  variables: LogVariable[];
  logBytes: number;
  eventBytes: number;
}

const EXAMPLES = {
  login: {
    template: 'Payment declined: {reason}. Customer {id} attempted ${amount} charge but account balance is ${balance}. Retry recommended with alternate payment method.',
    eventType: 'payment.declined',
    templateBytes: 140,
    examples: [
      {
        id: 1,
        fullLog: 'Payment declined: insufficient funds. Customer cust_8x9k2m attempted $299.99 charge but account balance is $45.20. Retry recommended with alternate payment method.',
        variables: [
          { key: 'reason', value: 'insufficient funds', placeholder: '{reason}', color: '#ef4444' },
          { key: 'id', value: 'cust_8x9k2m', placeholder: '{id}', color: '#00C2FF' },
          { key: 'amount', value: '299.99', placeholder: '{amount}', color: '#10b981' },
          { key: 'balance', value: '45.20', placeholder: '{balance}', color: '#f59e0b' }
        ],
        logBytes: 175,
        eventBytes: 68
      },
      {
        id: 2,
        fullLog: 'Payment declined: insufficient funds. Customer cust_3p7n1q attempted $149.50 charge but account balance is $12.80. Retry recommended with alternate payment method.',
        variables: [
          { key: 'reason', value: 'insufficient funds', placeholder: '{reason}', color: '#ef4444' },
          { key: 'id', value: 'cust_3p7n1q', placeholder: '{id}', color: '#00C2FF' },
          { key: 'amount', value: '149.50', placeholder: '{amount}', color: '#10b981' },
          { key: 'balance', value: '12.80', placeholder: '{balance}', color: '#f59e0b' }
        ],
        logBytes: 175,
        eventBytes: 68
      },
      {
        id: 3,
        fullLog: 'Payment declined: insufficient funds. Customer cust_1m5r8k attempted $89.99 charge but account balance is $5.00. Retry recommended with alternate payment method.',
        variables: [
          { key: 'reason', value: 'insufficient funds', placeholder: '{reason}', color: '#ef4444' },
          { key: 'id', value: 'cust_1m5r8k', placeholder: '{id}', color: '#00C2FF' },
          { key: 'amount', value: '89.99', placeholder: '{amount}', color: '#10b981' },
          { key: 'balance', value: '5.00', placeholder: '{balance}', color: '#f59e0b' }
        ],
        logBytes: 172,
        eventBytes: 66
      }
    ] as LogExample[]
  },
  checkout: {
    template: 'User {userId} completed checkout for order {orderId} total ${amount}',
    eventType: 'checkout.completed',
    templateBytes: 65,
    examples: [
      {
        id: 1,
        fullLog: 'User user-12345 completed checkout for order order-abc-123 total $129.99',
        variables: [
          { key: 'userId', value: 'user-12345', placeholder: '{userId}', color: '#00C2FF' },
          { key: 'orderId', value: 'order-abc-123', placeholder: '{orderId}', color: '#10b981' },
          { key: 'amount', value: '129.99', placeholder: '{amount}', color: '#f59e0b' }
        ],
        logBytes: 90,
        eventBytes: 45
      },
      {
        id: 2,
        fullLog: 'User user-67890 completed checkout for order order-def-456 total $249.50',
        variables: [
          { key: 'userId', value: 'user-67890', placeholder: '{userId}', color: '#00C2FF' },
          { key: 'orderId', value: 'order-def-456', placeholder: '{orderId}', color: '#10b981' },
          { key: 'amount', value: '249.50', placeholder: '{amount}', color: '#f59e0b' }
        ],
        logBytes: 90,
        eventBytes: 45
      },
      {
        id: 3,
        fullLog: 'User user-11111 completed checkout for order order-ghi-789 total $89.99',
        variables: [
          { key: 'userId', value: 'user-11111', placeholder: '{userId}', color: '#00C2FF' },
          { key: 'orderId', value: 'order-ghi-789', placeholder: '{orderId}', color: '#10b981' },
          { key: 'amount', value: '89.99', placeholder: '{amount}', color: '#f59e0b' }
        ],
        logBytes: 90,
        eventBytes: 45
      }
    ] as LogExample[]
  }
};

export const LogToEventDecomposition: React.FC<LogToEventDecompositionProps> = ({
  isMobile = false,
}) => {
  const { theme } = useTheme();
  const selectedExample = 'login';
  const [animationStage, setAnimationStage] = useState<'plain' | 'highlighting' | 'show_event_container' | 'populating_event' | 'replacing_variables' | 'complete'>('plain');
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [highlightingVariableIndex, setHighlightingVariableIndex] = useState(0);
  const [highlightingCharIndex, setHighlightingCharIndex] = useState(0);
  const [populatingStep, setPopulatingStep] = useState(-1); // Which event field we're adding
  const [populatingCharIndex, setPopulatingCharIndex] = useState(0); // Character index for typewriter effect
  const [replacingStep, setReplacingStep] = useState(-1); // Which variable we're replacing with placeholder
  const [isAnimating, setIsAnimating] = useState(false);

  const example = EXAMPLES[selectedExample];
  const currentLog = example.examples[currentLogIndex];

  // Auto-cycle through animation stages
  React.useEffect(() => {
    if (isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);

      if (animationStage === 'plain') {
        // Start highlighting first variable
        setAnimationStage('highlighting');
        setHighlightingVariableIndex(0);
        setHighlightingCharIndex(0);
        setTimeout(() => setIsAnimating(false), 50);
      } else if (animationStage === 'highlighting') {
        const currentVariable = currentLog.variables[highlightingVariableIndex];

        if (highlightingCharIndex < currentVariable.value.length - 1) {
          // Continue highlighting current variable
          setHighlightingCharIndex(prev => prev + 1);
          setTimeout(() => setIsAnimating(false), 80);
        } else if (highlightingVariableIndex < currentLog.variables.length - 1) {
          // Move to next variable
          setHighlightingVariableIndex(prev => prev + 1);
          setHighlightingCharIndex(0);
          setTimeout(() => setIsAnimating(false), 600);
        } else {
          // All variables highlighted, show event container
          setAnimationStage('show_event_container');
          setTimeout(() => setIsAnimating(false), 800);
        }
      } else if (animationStage === 'show_event_container') {
        // Start populating event data
        setAnimationStage('populating_event');
        setPopulatingStep(0);
        setPopulatingCharIndex(0);
        setTimeout(() => setIsAnimating(false), 300);
      } else if (animationStage === 'populating_event') {
        // Type out current field character by character
        const currentVariable = currentLog.variables[populatingStep];
        const maxKeyLength = Math.max(...currentLog.variables.map(v => v.key.length));
        const fullLine = `  ${currentVariable.key}:${' '.repeat(maxKeyLength - currentVariable.key.length + 1)}"${currentVariable.value}"`;

        if (populatingCharIndex < fullLine.length) {
          // Continue typing current line
          setPopulatingCharIndex(prev => prev + 1);
          setTimeout(() => setIsAnimating(false), 30); // 30ms per character
        } else if (populatingStep < currentLog.variables.length - 1) {
          // Move to next field
          setPopulatingStep(prev => prev + 1);
          setPopulatingCharIndex(0);
          setTimeout(() => setIsAnimating(false), 400); // Pause between fields
        } else {
          // All event data populated, start replacing variables
          setAnimationStage('replacing_variables');
          setReplacingStep(0);
          setTimeout(() => setIsAnimating(false), 1000);
        }
      } else if (animationStage === 'replacing_variables') {
        // Replace variables with placeholders one at a time
        if (replacingStep < currentLog.variables.length - 1) {
          setReplacingStep(prev => prev + 1);
          setTimeout(() => setIsAnimating(false), 1000);
        } else {
          setAnimationStage('complete');
          setTimeout(() => setIsAnimating(false), 1500);
        }
      } else if (animationStage === 'complete') {
        // Reset to next example
        setAnimationStage('plain');
        setHighlightingVariableIndex(0);
        setHighlightingCharIndex(0);
        setPopulatingStep(-1);
        setPopulatingCharIndex(0);
        setReplacingStep(-1);
        setCurrentLogIndex((prev) => (prev + 1) % example.examples.length);
        setTimeout(() => setIsAnimating(false), 600);
      }
    }, animationStage === 'plain' ? 2500 : animationStage === 'complete' ? 3000 : 0);

    return () => clearTimeout(timer);
  }, [animationStage, highlightingVariableIndex, highlightingCharIndex, populatingStep, populatingCharIndex, replacingStep, currentLog.variables, example.examples.length, isAnimating]);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationStage('plain');
      setHighlightingVariableIndex(0);
      setHighlightingCharIndex(0);
      setPopulatingStep(-1);
      setPopulatingCharIndex(0);
      setReplacingStep(-1);
      setCurrentLogIndex((prev) => (prev + 1) % example.examples.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Render log based on animation stage with character-by-character highlighting
  const renderLog = () => {
    let displayText = currentLog.fullLog;

    if (animationStage === 'highlighting') {
      // Progressively highlight variables character by character
      currentLog.variables.forEach((variable, varIdx) => {
        if (varIdx < highlightingVariableIndex) {
          // Fully highlighted
          displayText = displayText.replace(
            variable.value,
            `<span style="color: ${variable.color}; font-weight: bold;">${variable.value}</span>`
          );
        } else if (varIdx === highlightingVariableIndex) {
          // Partially highlighted
          const highlightedPart = variable.value.substring(0, highlightingCharIndex + 1);
          const remainingPart = variable.value.substring(highlightingCharIndex + 1);
          displayText = displayText.replace(
            variable.value,
            `<span style="color: ${variable.color}; font-weight: bold;">${highlightedPart}</span>${remainingPart}`
          );
        }
      });
    } else if (animationStage === 'show_event_container' || animationStage === 'populating_event') {
      // Keep all variables highlighted (not replaced yet)
      currentLog.variables.forEach((variable) => {
        displayText = displayText.replace(
          variable.value,
          `<span style="color: ${variable.color}; font-weight: bold;">${variable.value}</span>`
        );
      });
    } else if (animationStage === 'replacing_variables' || animationStage === 'complete') {
      // Replace variables with placeholders one at a time
      const numToReplace = animationStage === 'complete' ? currentLog.variables.length : replacingStep + 1;
      currentLog.variables.forEach((variable, idx) => {
        if (idx < numToReplace) {
          displayText = displayText.replace(
            variable.value,
            `<span style="color: ${variable.color}; font-weight: bold;">${variable.placeholder}</span>`
          );
        } else {
          displayText = displayText.replace(
            variable.value,
            `<span style="color: ${variable.color}; font-weight: bold;">${variable.value}</span>`
          );
        }
      });
    }

    return <span dangerouslySetInnerHTML={{ __html: displayText }} />;
  };

  // Get populated event data based on current step
  const getPopulatedEventData = () => {
    if (animationStage === 'show_event_container') {
      return []; // Empty
    } else if (animationStage === 'populating_event') {
      return currentLog.variables.slice(0, populatingStep + 1);
    } else if (animationStage === 'replacing_variables' || animationStage === 'complete') {
      return currentLog.variables; // All populated
    }
    return [];
  };

  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : "80px 40px",
        background: "linear-gradient(180deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.95) 100%)",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "40px",
              fontWeight: "400",
              lineHeight: "1.15",
              letterSpacing: "-0.025em",
              marginBottom: "16px",
              fontFamily: theme.fonts.body,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <span style={{ color: "#10b981" }}>Event Templates</span>
            <span style={{ color: "#ffffff" }}>&gt;</span>
            <span style={{ color: "#ef4444" }}>Logs</span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              lineHeight: "1.6",
              maxWidth: "700px",
              margin: "0 auto",
              fontFamily: theme.fonts.body,
            }}
          >
            <span style={{ color: "#ef4444" }}>
              Traditional logs repeat the same text over and over. And you're paying for it.
            </span>
            <br />
            <span style={{ color: "#10b981" }}>
              Events use templates that are stored once and reused millions of times.
            </span>
          </p>
        </motion.div>

        {/* Main Transformation Container */}
        <div style={{ minHeight: "500px" }} onClick={handleClick}>
          {/* Single Container */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                padding: isMobile ? "16px" : "24px",
                borderRadius: "12px",
                border: `1px solid ${
                  animationStage === 'complete'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'
                }`,
                background: "rgba(17, 24, 39, 0.6)",
                backdropFilter: "blur(12px)",
                cursor: "pointer",
                transition: "border-color 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: animationStage === 'complete' ? "#10b981" : "#ef4444",
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  {animationStage === 'complete' ? 'TEMPLATE' : 'TRADITIONAL LOG'}
                </h3>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    fontFamily: "monospace",
                  }}
                >
                  {animationStage === 'complete' ? `${example.templateBytes} bytes` : `${currentLog.logBytes} bytes`}
                </span>
              </div>

              {/* Template/Log */}
              <div style={{ marginBottom: (animationStage === 'show_event_container' || animationStage === 'populating_event' || animationStage === 'replacing_variables' || animationStage === 'complete') ? "16px" : "0" }}>
                <pre
                  style={{
                    fontFamily: "monospace",
                    fontSize: isMobile ? "11px" : "13px",
                    color: "#e5e7eb",
                    lineHeight: "1.6",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {renderLog()}
                </pre>
              </div>

              {/* Event Data - Appears Below in Same Container */}
              {(animationStage === 'show_event_container' || animationStage === 'populating_event' || animationStage === 'replacing_variables' || animationStage === 'complete') && (
                <div
                  style={{
                    borderTop: "1px solid rgba(0, 194, 255, 0.2)",
                    paddingTop: "16px",
                    marginTop: "16px",
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px"
                  }}>
                    <h3 style={{
                      fontSize: "14px",
                      color: "#00C2FF",
                      fontFamily: "monospace",
                      fontWeight: "600",
                      letterSpacing: "0.05em",
                      margin: 0
                    }}>
                      EVENT DATA
                    </h3>
                    <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "monospace" }}>
                      {currentLog.eventBytes} bytes
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: isMobile ? "11px" : "13px",
                      lineHeight: "1.6",
                      whiteSpace: "pre",
                    }}
                  >
                    <div style={{ color: "#e5e7eb" }}>{'{'}</div>
                    {(() => {
                      const data = getPopulatedEventData();
                      const maxKeyLength = Math.max(...currentLog.variables.map(v => v.key.length));

                      return data.map((v, idx) => {
                        const key = v.key;
                        const padding = ' '.repeat(maxKeyLength - key.length + 1);
                        const value = v.value;
                        const prefix = `  ${key}:${padding}"`;
                        const suffix = `"${idx < data.length - 1 ? ',' : ''}`;

                        // If we're currently populating and this is the active line, show typewriter effect
                        if (animationStage === 'populating_event' && idx === populatingStep) {
                          const fullLine = prefix + value + suffix;
                          const typed = fullLine.substring(0, populatingCharIndex);
                          const prefixLen = prefix.length;
                          const valueLen = value.length;

                          return (
                            <div key={idx}>
                              {populatingCharIndex <= prefixLen ? (
                                // Still typing prefix
                                <span style={{ color: "#e5e7eb" }}>{typed}</span>
                              ) : populatingCharIndex <= prefixLen + valueLen ? (
                                // Typing value
                                <>
                                  <span style={{ color: "#e5e7eb" }}>{prefix}</span>
                                  <span style={{ color: v.color, fontWeight: "bold" }}>{value.substring(0, populatingCharIndex - prefixLen)}</span>
                                </>
                              ) : (
                                // Typing suffix
                                <>
                                  <span style={{ color: "#e5e7eb" }}>{prefix}</span>
                                  <span style={{ color: v.color, fontWeight: "bold" }}>{value}</span>
                                  <span style={{ color: "#e5e7eb" }}>{suffix.substring(0, populatingCharIndex - prefixLen - valueLen)}</span>
                                </>
                              )}
                            </div>
                          );
                        }

                        // Otherwise show full line with colored value
                        return (
                          <div key={idx}>
                            <span style={{ color: "#e5e7eb" }}>{prefix}</span>
                            <span style={{ color: v.color, fontWeight: "bold" }}>{value}</span>
                            <span style={{ color: "#e5e7eb" }}>{suffix}</span>
                          </div>
                        );
                      });
                    })()}
                    <div style={{ color: "#e5e7eb" }}>{'}'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>
            {animationStage === 'plain' && 'Watching...'}
            {animationStage === 'highlighting' && `Identifying variable ${highlightingVariableIndex + 1}/${currentLog.variables.length}: "${currentLog.variables[highlightingVariableIndex].key}"...`}
            {animationStage === 'show_event_container' && 'Creating event data container...'}
            {animationStage === 'populating_event' && `Adding field ${populatingStep + 1}/${currentLog.variables.length} to event data...`}
            {animationStage === 'replacing_variables' && `Replacing variable ${replacingStep + 1}/${currentLog.variables.length} with placeholder...`}
            {animationStage === 'complete' && 'Complete! Next example in a moment...'}
          </div>
        </div>

      </div>
    </section>
  );
};
