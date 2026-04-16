# Anthropic Just Paid Datadog $10M+. Here's the Question They Should Be Asking Instead.

**Published:** February 20, 2026
**Tags:** Observability, Industry Analysis, AI Agents

## When AI agents write production code, observability tools tell you what broke. Story-based monitoring tells you if what shipped is what you intended.

Last week, Datadog dropped their Q4 2025 earnings. Buried in the call was a number that lit up X (formerly Twitter): an 8-figure annualized deal with "one of the largest AI foundational model companies."

Everyone figured out pretty quickly they were talking about Anthropic. The company behind Claude. Arguably one of the most capable AI engineering teams on the planet.

And they just wrote Datadog a check for over $10 million a year. For monitoring.

The thread that followed was wild. People asking "when can we burn Datadog?" Others pointing out you can't just vibe code reliability and accountability.

But almost everyone in that thread was debating the wrong question.

## The Wrong Question: Can You Vibe Code a Datadog Clone?

The debate went exactly where you'd expect. Can frontier AI labs just build their own observability tools? Why pay $10M+ when you have some of the best engineers in the world?

The answer from Datadog's CEO was straightforward: it's cheaper to buy than build. Their engineers are expensive. Their velocity matters. Observability is hard. Fair enough.

But that answer accepts the premise that observability as it exists today is the right thing to buy.

## The Real Question: Why Are the Best AI Companies Still Using Tools Built for Humans?

Datadog, Honeycomb, New Relic, Dynatrace. Different UIs. Same assumption underneath: collect everything, store it somewhere, and when things go sideways, hopefully a human can piece together the timeline.

That assumption held up when the person debugging the system was the person who built it. You had context. You had intuition. You knew what "normal" looked like because you wrote the code.

**When AI agents are writing production code faster than any human can review it, "what happened?" is already too late.**

67% of developers now report spending more time debugging AI-generated code than code they wrote themselves. 91% have unresolved bugs they can't reproduce. That's not a tooling problem. That's a comprehension problem.

## Comprehension Debt

It's called comprehension debt. The widening distance between what agents produce and what humans can actually verify. Every agent-written commit adds to it. Every tool that dumps more unstructured data into your stack makes it worse.

Think about what Anthropic is actually paying for here. $10M+ a year to store and search massive volumes of telemetry data. Spans, traces, metrics, logs. Mountains of it. And somewhere in that mountain is the answer to "why did this break?"

That's an expensive way to find a needle when you could have just not built the haystack.

## A Different Starting Point: Story-Based Monitoring

What if you started from intent instead of data? Start from what should happen, not from what already broke.

That's what we're building at Principal AI.

The old model works backward. Something fails. You open a dashboard. You query logs. You correlate traces. Hours later, maybe you find it.

Our model works forward. You define what the code should do under specific conditions. The system validates whether it actually did. And when reality doesn't match intent, you see exactly where it diverged. Visually. In minutes, not hours.

We're not building a smarter search engine for your logs. We're eliminating the need to search in the first place.

## Why This Matters Right Now

Cursor just hit a $29.3B valuation. 84% of developers use AI coding tools. 59% admit they ship AI-generated code they don't fully understand.

Read that last number again. More than half of developers are putting code into production that they can't fully explain. And the monitoring tools they're relying on were designed for a world where the developer and the debugger were the same person.

That world is gone. The tools haven't caught up.

Anthropic paying Datadog $10M+ is a signal. It means observability is critical. It means the problem is real. And it means even the most capable AI teams in the world are still buying the best version of yesterday's answer.

## Different Question. Different Architecture.

We're building around a different question entirely: did what shipped actually match what you intended?

---

**See What Story-Based Monitoring Looks Like**

Explore real codebases in our [Gallery](https://app.principal-ade.com), or [learn more](https://principal-ade.com) about getting early access to System Stories.
