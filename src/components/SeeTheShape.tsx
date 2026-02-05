import React, { useState } from 'react';
import Image from 'next/image';

interface SeeTheShapeProps {
  isMobile?: boolean;
}

export const SeeTheShape: React.FC<SeeTheShapeProps> = ({ isMobile = false }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Repo URL:', repoUrl);
    console.log('Email:', email);
  };

  return (
    <div
      style={{
        padding: isMobile ? '0 24px' : '0 40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '40px' : '60px',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {/* Left Column - Content and Form */}
        <div>
          <h1
            style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '600',
              color: '#ffffff',
              margin: '0 0 20px 0',
              lineHeight: '1.15',
              letterSpacing: '-0.025em',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            See the shape of your codebase
          </h1>
          <p
            style={{
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '400',
              color: '#9ca3af',
              margin: '0 0 24px 0',
              lineHeight: '1.6',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            You don't really know what you've built until you can see it.
          </p>
          <p
            style={{
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '400',
              color: '#9ca3af',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Principal turns your repository into a living map showing:
          </p>
          <ul
            style={{
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '400',
              color: '#9ca3af',
              margin: '0 0 16px 0',
              paddingLeft: '24px',
              lineHeight: '1.8',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <li>Structure</li>
            <li>Size</li>
            <li>Complexity</li>
            <li>Composition</li>
            <li>What's changing</li>
          </ul>
          <p
            style={{
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '400',
              color: '#9ca3af',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            All at once.
          </p>
          <p
            style={{
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '500',
              color: '#ffffff',
              margin: '0 0 40px 0',
              lineHeight: '1.6',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #00C2FF, #0098CC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: "600",
              }}
            >
              File City
            </span>{" "}
            is not a metaphor. It's a navigable model of your system.
          </p>

          {/* Form Card */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.6)',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '16px',
              padding: isMobile ? '32px 24px' : '40px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '600',
                color: '#ffffff',
                margin: '0 0 8px 0',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Get your repo mapped for free
            </h2>
            <p
              style={{
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '400',
                color: '#9ca3af',
                margin: '0 0 24px 0',
                lineHeight: '1.5',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Drop your GitHub URL. We'll generate your File City and send it to you.
            </p>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="github.com/your/repo"
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(51, 65, 85, 0.6)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    color: '#ffffff',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0099FF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.6)';
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(51, 65, 85, 0.6)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    color: '#ffffff',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0099FF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.6)';
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#00C2FF',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00d4ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#00C2FF';
                  }}
                >
                  Map It
                </button>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: '0',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                We'll send your File City map to your inbox when ready.
              </p>
            </form>
          </div>
        </div>

        {/* Right Column - File City Visualization */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.4)',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(8px)',
            position: 'relative',
          }}
        >
          <Image
            src="/tldraw-example.png"
            alt="File City visualization"
            width={800}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>
    </div>
  );
};
