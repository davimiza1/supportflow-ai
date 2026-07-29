"use client";

import { useMemo, useState } from "react";

type Ticket = {
  id: string;
  customer: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  mood: "Frustrated" | "Neutral" | "Positive";
  priority: "Urgent" | "High" | "Normal";
  confidence: number;
  channel: string;
};

const tickets: Ticket[] = [
  { id: "#4821", customer: "Maya Chen", email: "maya@northstar.co", subject: "Charged twice for Pro plan", preview: "I upgraded yesterday and can see two identical charges...", time: "2m", mood: "Frustrated", priority: "Urgent", confidence: 96, channel: "Email" },
  { id: "#4820", customer: "Jon Bell", email: "jon@arcform.io", subject: "Can I export my workspace?", preview: "We're moving our quarterly data into our internal warehouse...", time: "8m", mood: "Neutral", priority: "Normal", confidence: 91, channel: "Chat" },
  { id: "#4819", customer: "Amara Okafor", email: "amara@brightlabs.dev", subject: "Team invite links expired", preview: "Three of our new teammates cannot join the workspace...", time: "14m", mood: "Frustrated", priority: "High", confidence: 88, channel: "Email" },
  { id: "#4818", customer: "Noah Williams", email: "noah@relay.studio", subject: "Love the new analytics view", preview: "The new dashboard has made our weekly review so much easier...", time: "27m", mood: "Positive", priority: "Normal", confidence: 98, channel: "Chat" },
];

export default function Home() {
  const [active, setActive] = useState(tickets[0]);
  const [filter, setFilter] = useState("All");
  const [draft, setDraft] = useState(
    "Hi Maya,\n\nI’m sorry about the duplicate charge — I can see why that would be concerning. I found both transactions and have started a refund for the duplicate payment. It should appear on your statement within 5–7 business days.\n\nYour Pro plan remains active, and no action is needed from you.\n\nBest,\nDawood"
  );
  const [sent, setSent] = useState(false);
  const [autopilot, setAutopilot] = useState(true);

  const visible = useMemo(
    () => tickets.filter((t) => filter === "All" || t.priority === filter),
    [filter]
  );

  function selectTicket(ticket: Ticket) {
    setActive(ticket);
    setSent(false);
    setDraft(
      ticket.id === "#4821"
        ? "Hi Maya,\n\nI’m sorry about the duplicate charge — I can see why that would be concerning. I found both transactions and have started a refund for the duplicate payment. It should appear on your statement within 5–7 business days.\n\nYour Pro plan remains active, and no action is needed from you.\n\nBest,\nDawood"
        : `Hi ${ticket.customer.split(" ")[0]},\n\nThanks for reaching out. I reviewed your request and found the relevant account details. I can help you resolve this right away.\n\nI’ve included the next steps below and will stay on this ticket until everything is sorted.\n\nBest,\nDawood`
    );
  }

  return (
    <main className="app">
      <aside className="rail">
        <div className="logo"><span>sf</span></div>
        <nav aria-label="Primary">
          <button className="active" aria-label="AI inbox">⌁</button>
          <button aria-label="Analytics">⌗</button>
          <button aria-label="Knowledge base">◇</button>
          <button aria-label="Automations">↯</button>
        </nav>
        <div className="railBottom">
          <button aria-label="Settings">⚙</button>
          <span className="avatar">MD</span>
        </div>
      </aside>

      <section className="shell">
        <header className="topbar">
          <div>
            <div className="brand">SupportFlow <b>AI</b></div>
            <span className="workspace">Northstar workspace</span>
          </div>
          <div className="topActions">
            <div className="autopilot">
              <span className={autopilot ? "liveDot" : "offDot"} />
              <div><b>Autopilot</b><small>{autopilot ? "Watching 4 channels" : "Paused"}</small></div>
              <button className={autopilot ? "switch on" : "switch"} onClick={() => setAutopilot(!autopilot)} aria-label="Toggle autopilot"><i /></button>
            </div>
            <button className="command">⌘ K</button>
            <button className="newButton">＋ New ticket</button>
          </div>
        </header>

        <section className="pulsebar">
          <div><span className="pulseIcon">✦</span><p><b>AI shift pulse</b><small>38 tickets resolved autonomously today</small></p></div>
          <div className="pulseStats">
            <p><b>42s</b><small>First response</small></p>
            <p><b>94%</b><small>AI accuracy</small></p>
            <p><b>4.9</b><small>Customer score</small></p>
          </div>
          <div className="spark"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
        </section>

        <div className="workspaceGrid">
          <section className="inbox">
            <div className="panelHead">
              <div><h1>Priority inbox</h1><span className="count">12</span></div>
              <button aria-label="Inbox options">•••</button>
            </div>
            <div className="filters">
              {["All", "Urgent", "High"].map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>
              ))}
              <button className="filterIcon">≡</button>
            </div>
            <div className="ticketList">
              {visible.map((ticket) => (
                <button key={ticket.id} onClick={() => selectTicket(ticket)} className={`ticket ${active.id === ticket.id ? "active" : ""}`}>
                  <div className="ticketTop">
                    <span className={`customerAvatar mood-${ticket.mood.toLowerCase()}`}>{ticket.customer.split(" ").map(n => n[0]).join("")}</span>
                    <p><b>{ticket.customer}</b><small>{ticket.email}</small></p>
                    <time>{ticket.time}</time>
                  </div>
                  <h3>{ticket.subject}</h3>
                  <p className="preview">{ticket.preview}</p>
                  <div className="ticketMeta">
                    <span className={`priority ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                    <span>{ticket.channel}</span>
                    <span className="aiScore">✦ {ticket.confidence}%</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="conversation">
            <div className="conversationHead">
              <div><span className="customerAvatar mood-frustrated">{active.customer.split(" ").map(n => n[0]).join("")}</span><p><b>{active.subject}</b><small>{active.customer} · {active.id}</small></p></div>
              <div><button>Assign</button><button>•••</button></div>
            </div>

            <div className="thread">
              <div className="message customerMessage">
                <div className="messageLabel"><b>{active.customer}</b><span>Today, 10:42 AM</span></div>
                <p>{active.id === "#4821" ? "Hi, I upgraded to the Pro plan yesterday but my card was charged twice. Both charges are showing as completed. Could you please check this and refund the duplicate charge?" : active.preview}</p>
              </div>

              <div className="aiReasoning">
                <div className="aiTitle"><span>✦</span><p><b>AI analysis complete</b><small>Reasoning grounded in 3 trusted sources</small></p><strong>{active.confidence}% confidence</strong></div>
                <div className="signals">
                  <span>Intent <b>Billing issue</b></span><span>Sentiment <b>{active.mood}</b></span><span>Risk <b>{active.priority === "Urgent" ? "Churn risk" : "Low"}</b></span>
                </div>
                <div className="evidence"><b>↳ Recommended action</b><p>Verify duplicate transaction, initiate refund, reassure customer that their plan remains active.</p></div>
              </div>

              <div className="composer">
                <div className="composerTop"><span className="magic">✦ AI drafted a reply</span><div><button>Shorter</button><button>Friendlier</button><button>Rewrite</button></div></div>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Reply draft" />
                <div className="sources"><span>Grounded in</span><button>Refund policy ↗</button><button>Billing FAQ ↗</button><button>Account data ↗</button></div>
                <div className="sendRow">
                  <div><button>☺</button><button>⌁</button><button>▱</button></div>
                  <div><button className="save">Save draft</button><button className="send" onClick={() => setSent(true)}>{sent ? "✓ Sent" : "Send reply"} <span>⌘↵</span></button></div>
                </div>
              </div>
            </div>
          </section>

          <aside className="context">
            <div className="contextHead"><h2>Customer context</h2><button>×</button></div>
            <div className="profileCard">
              <span className="profileAvatar">{active.customer.split(" ").map(n => n[0]).join("")}</span>
              <h3>{active.customer}</h3><p>{active.email}</p>
              <div><span><b>Pro</b><small>Plan</small></span><span><b>$49</b><small>MRR</small></span><span><b>14 mo</b><small>Customer</small></span></div>
            </div>
            <section className="contextSection"><div><h3>AI next best action</h3><span className="confidence">{active.confidence}%</span></div><p>Issue refund for the duplicate charge and apply a 10% loyalty credit.</p><button className="actionButton">Run action <span>↗</span></button></section>
            <section className="contextSection"><h3>Journey</h3><div className="timeline"><p><i/>Duplicate payment detected<small>Today · Stripe</small></p><p><i/>Upgraded to Pro<small>Yesterday · $49/mo</small></p><p><i/>First project created<small>14 months ago</small></p></div></section>
            <section className="contextSection"><h3>Similar cases</h3><button className="case"><span>✓</span><p><b>Duplicate annual charge</b><small>Resolved in 3 minutes</small></p><em>94%</em></button><button className="case"><span>✓</span><p><b>Plan upgrade billing</b><small>Resolved in 6 minutes</small></p><em>87%</em></button></section>
          </aside>
        </div>
      </section>
    </main>
  );
}
