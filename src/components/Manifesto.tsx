"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

export const Manifesto: React.FC = () => {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Helper style functions using theme
  const bodyTextStyle = (mobile: boolean): React.CSSProperties => ({
    fontSize: mobile ? "15px" : "17px",
    lineHeight: "1.75",
    color: theme.colors.textSecondary,
    marginBottom: "24px",
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: "400",
  });

  return (
    <div
      style={{
        background: "#f7fcfd",
      }}
    >
      {/* Single continuous section */}
      <section
        style={{
          padding: isMobile ? "80px 24px 80px" : "120px 40px 100px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: "11px",
              color: theme.colors.primary,
              textAlign: "center",
              marginBottom: "16px",
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: "500",
            }}
          >
            We believe you should
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "700",
              color: theme.colors.text,
              textAlign: "center",
              marginBottom: isMobile ? "48px" : "64px",
              lineHeight: "1.05",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: "-0.04em",
            }}
          >
            Know it like you wrote it.
          </motion.h1>

          {/* All content in one continuous flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={bodyTextStyle(isMobile)}>
              It did it. No. <em>You</em> did it.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              You typed in some code and the machine did something. Holy cow, it worked.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              So you kept going. You had the whole thing in your head and you didn't stop until it was real.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              You didn't study the architecture, you absorbed it. The codebase was a thing you lived in. Every feature, every bug, every "while I'm in here" change dropped another marker on the map in your head. Debugging could even be fun, a reason to visit an old part of the code and say hi, dysfunctional or not. If something broke, you knew where to look, because you were the one who put it there.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              That feeling has a name. It's called <strong style={{ fontWeight: "700", color: theme.colors.text }}>building</strong>. And it's the reason any of us are here.
            </p>
            <p style={{
              fontSize: isMobile ? "24px" : "32px",
              lineHeight: "1.4",
              color: "#1a2842",
              marginTop: isMobile ? "32px" : "48px",
              marginBottom: isMobile ? "32px" : "48px",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: "700",
            }}>
              Then agents showed up.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Dang they're fast. They took the typing, the grind, the part you were happy to hand over. But they took something else. Your mental map.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              The first time you feel it, it's small. A pull request that reads like a stranger wrote it. A function you don't remember. A feature your team shipped that you couldn't quite explain if someone stopped you in the hallway. And then one day you catch yourself thinking...
            </p>
            <p style={{ ...bodyTextStyle(isMobile), fontStyle: "italic", color: theme.colors.text }}>
              The agent wrote this, and before I merge it, I need to know it.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              That sentence is new to 2026 because you don't take the same journey you did before, so the mental model never formed.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              And yet your name is still attached to what ships.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Your. Name. The one with a reputation behind it. The one that got there because over the years you developed judgment. You learned when to trust your instincts, when to keep digging, when something felt just a little off. No one sends a panic ping to Cursor. Codex wasn't in the after-action meeting when the client almost left. Nobody puts Claude on a PIP.
            </p>
            <p style={{
              fontSize: isMobile ? "24px" : "32px",
              lineHeight: "1.4",
              color: "#1a2842",
              marginTop: isMobile ? "32px" : "48px",
              marginBottom: isMobile ? "32px" : "48px",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: "700",
            }}>
              The responsibility never moved to the agent. Only the typing did.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We want agents to get ridiculously good.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We just don't want to lose the part of building that made us fall in love with it in the first place. The curiosity. The thinking. The satisfaction of finally understanding something well enough to say, "Okay, now I'm comfortable putting my name on this."
            </p>
            <p style={bodyTextStyle(isMobile)}>
              That's why we built Code Trails.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Every trail starts with a real question because that's where understanding has always started. Someone wonders why something works the way it does, or why it doesn't. They follow the evidence. They pull on threads. They ask another person to take a look. Eventually the picture comes into focus.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              In most teams, that work disappears. It lives in a chat thread, a meeting, or somebody's memory.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We think that's a mistake.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Those investigations are some of the most valuable things a team creates.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              A trail keeps that understanding alive. Someone else can open it next week. Another engineer can add a note. An architect can challenge an assumption. An agent can pick up where a human left off. Instead of repeating the same investigation, the next person starts one step further along.
            </p>
            <p style={{ ...bodyTextStyle(isMobile), fontStyle: "italic", color: theme.colors.text }}>
              The knowing compounds.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We think that's how organizations get smarter.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              But we also think it changes how we should think about production.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Most monitoring begins after something breaks. The software is already running, and now we're trying to figure out what happened.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>We've always felt that's starting at the wrong end of the story.</strong>
            </p>
            <p style={bodyTextStyle(isMobile)}>
              The real story began much earlier, when somebody asked a question. Why are we building it this way? What did we expect it to do, and what were we willing to trade to get there?
            </p>
            <p style={bodyTextStyle(isMobile)}>
              If those questions mattered before the software shipped, they shouldn't become invisible after it does.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              The understanding should follow the code into production, where reality can be measured against the intent that created it in the first place.
            </p>
            <p style={{ ...bodyTextStyle(isMobile), fontStyle: "italic", color: theme.colors.text }}>
              To us, that's one continuous story. From the first question all the way to production.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We're three founders who met in line at a pitch contest. Bootstrapped, patents filed, a working product we use to build itself every day.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We didn't set out to build another developer tool.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We set out to protect the reason we became builders in the first place.
            </p>

            <p style={{
              fontSize: isMobile ? "24px" : "32px",
              lineHeight: "1.2",
              fontWeight: "700",
              color: theme.colors.primary,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginTop: isMobile ? "48px" : "64px",
              marginBottom: "0",
            }}>
              For the love of building.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
