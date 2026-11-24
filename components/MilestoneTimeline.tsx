"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Heart, MapPin, Plus, Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Milestone {
  id: string;
  date: string;
  title: string;
  badge: string;
  description: string;
  detail: string;
  location?: string;
  icon: string;
}

const defaultMilestones: Milestone[] = [
  {
    id: "1",
    date: "23 November 2025",
    badge: "Day 1",
    title: "The Day My Universe Changed",
    description: "The moment our eyes met, something inside me whispered that you were going to be someone very special.",
    detail: "I still remember the butterflies, your radiant smile, and the effortless way you made me smile from minute one on my sister's wedding day. That single day changed the entire trajectory of my life.",
    location: "Where It All Began",
    icon: "✨",
  },
  {
    id: "2",
    date: "25 November 2025",
    badge: "First Meeting",
    title: "That Room Where Time Stood Still",
    description: "We met alone for the first time, and suddenly 5 hours had vanished into thin air.",
    detail: "I was very nervous. We closed the door, talked about our old memories, Then When I finally proposed... and you said yes, I felt like the luckiest person alive. That day, I realized that love is not just a feeling; it's a beautiful journey we embark on together.",
    location: "Our Favorite Cozy Corner",
    icon: "✨",
  },
  {
    id: "3",
    date: "December 2026",
    badge: "Little Moments",
    title: "Evening meetings at Rajiv chowk",
    description: "My heart always races when I see you.",
    detail: "When we meet at Rajiv chowk every Saturday That little moment were so special, I knew I was meeting my forever person. Loving you was the easiest decision I ever made. I wait whole week for that moment when I see you, and every time, my heart skips a beat.",
    location: "Under The setting Sun",
    icon: "💖",
  },
  {
    id: "4",
    date: "5 January 2026",
    badge: "First Park Date",
    title: "Our First Little Getaway & Adventure",
    description: "Our first date at the park was magical.",
    detail: "When we walked hand in hand, the world seemed to fade away, leaving just the two of us. The laughter, the shared stories, and the gentle breeze made it a day I'll never forget. That day, I realized that love is not just about grand gestures; it's about the simple moments that make our hearts feel full.",
    location: "Lodhi Garden, New Delhi",
    icon: "✈️",
  },
  {
    id: "5",
    date: "August 2026",
    badge: "Everyday Magic",
    title: "The Sweet Ordinary Days",
    description: "Texting, sharing everything happend in our daily lives, and falling asleep on late night calls.",
    detail: "It's not just the dates I cherish; it's you leaning on my shoulder while watching our favorite show, our inside jokes nobody else gets, and the peaceful silence when we are together.",
    location: "Our Cozy Bubble",
    icon: "🌙",
  },
  {
    id: "6",
    date: "25 November 2026",
    badge: "365 Days!",
    title: "Our 1st Anniversary — 1 Year Down, Forever To Go",
    description: "365 days of you being my greatest blessing, my safest harbor, and my happiest home.",
    detail: "Looking back at this past year, every memory sparkles because you're in it. Thank you for choosing me every single day. I love you more than words could ever describe.",
    location: "Right Here, With You",
    icon: "💍",
  },
];

export default function MilestoneTimeline() {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [expandedId, setExpandedId] = useState<string | null>("6");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New milestone form state
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newIcon, setNewIcon] = useState("💖");

  // Load persisted milestones
  useEffect(() => {
    try {
      const saved = localStorage.getItem("anniversary_milestones");
      if (saved) {
        setMilestones(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveMilestonesToStorage = (updated: Milestone[]) => {
    setMilestones(updated);
    try {
      localStorage.setItem("anniversary_milestones", JSON.stringify(updated));
    } catch {}
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim()) return;

    const newItem: Milestone = {
      id: Date.now().toString(),
      date: newDate.trim(),
      badge: newBadge.trim() || "Sweet Memory",
      title: newTitle.trim(),
      description: newDesc.trim() || "A beautiful memory in our journey.",
      detail: newDetail.trim() || newDesc.trim() || "Forever in my heart.",
      location: newLocation.trim() || "With You",
      icon: newIcon || "💖",
    };

    const updated = [...milestones, newItem];
    saveMilestonesToStorage(updated);
    setShowAddModal(false);
    setNewDate("");
    setNewTitle("");
    setNewBadge("");
    setNewDesc("");
    setNewDetail("");
    setNewLocation("");
  };

  const handleDeleteMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Remove this milestone?")) {
      const updated = milestones.filter((m) => m.id !== id);
      saveMilestonesToStorage(updated);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="milestones" className="py-20 px-4 relative max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs uppercase tracking-widest font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Our Love Story</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          365 Days of <span className="text-glow text-rose-400">Milestones</span>
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Every step of our journey has been a masterpiece. Here are some of the moments that made my heart yours forever.
        </p>

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-medium hover:bg-rose-900/40 hover:border-rose-400 transition-all shadow-md"
        >
          <Plus className="w-4 h-4 text-rose-400" />
          <span>Add Our Own Milestone</span>
        </button>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e0714] border border-rose-500/40 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" /> Add a Special Milestone
            </h3>
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div>
                <label className="text-xs text-rose-300 block mb-1">Date</label>
                <input
                  type="text"
                  placeholder="e.g. 14 February 2026 or That Rainy Tuesday"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs text-rose-300 block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. The Night We Watched The Stars"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-rose-300 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Unforgettable"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-rose-300 block mb-1">Emoji Icon</label>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400"
                  >
                    <option value="💖">💖 Heart</option>
                    <option value="✨">✨ Sparkle</option>
                    <option value="☕">☕ Coffee</option>
                    <option value="✈️">✈️ Travel</option>
                    <option value="🌙">🌙 Moon</option>
                    <option value="🎬">🎬 Movie</option>
                    <option value="💍">💍 Ring</option>
                    <option value="🍕">🍕 Food Date</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-rose-300 block mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  placeholder="What made this moment so special?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-rose-300 block mb-1">Detailed Story (Expandable)</label>
                <textarea
                  rows={2}
                  placeholder="Any sweet quotes or extra feelings..."
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-rose-300 block mb-1">Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Central Beach Cafe"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-rose-600/30"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* The Central Glowing Ribbon Timeline */}
      <div className="relative">
        {/* Vertical line running down the center on desktop, left on mobile */}
        <div className="absolute top-0 bottom-0 left-6 sm:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-rose-500 via-pink-500 to-amber-300 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />

        <div className="space-y-12">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? "sm:flex-row-reverse" : ""
                } gap-6`}
              >
                {/* Center Node Icon */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-rose-700 to-pink-500 border-4 border-[#0d0309] shadow-lg shadow-rose-500/50 text-xl cursor-pointer hover:scale-110 transition-transform">
                  <span>{item.icon}</span>
                </div>

                {/* Content Card (placed on one side) */}
                <div
                  className={`w-full sm:w-[calc(50%-2.5rem)] pl-16 sm:pl-0 ${
                    isEven ? "sm:pr-4 sm:text-right" : "sm:pl-4 sm:text-left"
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="group relative p-6 rounded-3xl glass-card glass-card-hover cursor-pointer border border-rose-500/20 hover:border-rose-400/50"
                  >
                    {/* Badge and Date */}
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isEven ? "sm:justify-end" : "justify-start"
                      }`}
                    >
                      <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
                        {item.badge}
                      </span>
                      <span className="text-xs text-rose-300/70 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-200 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-rose-200/80 text-sm mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-rose-500/20 space-y-2 animate-fadeIn">
                        <p className="text-xs sm:text-sm text-pink-100/90 italic bg-rose-950/40 p-3 rounded-xl border border-rose-500/20">
                          &ldquo;{item.detail}&rdquo;
                        </p>
                        {item.location && (
                          <div
                            className={`flex items-center gap-1 text-xs text-rose-300/70 pt-1 ${
                              isEven ? "sm:justify-end" : "justify-start"
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle expand indicator & delete button */}
                    <div
                      className={`flex items-center justify-between mt-3 pt-2 text-xs text-rose-400/80 ${
                        isEven ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      <span className="flex items-center gap-1 hover:text-rose-200">
                        {isExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Read memory</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </span>

                      {/* Delete button if custom added */}
                      {Number(item.id) > 10 && (
                        <button
                          onClick={(e) => handleDeleteMilestone(item.id, e)}
                          className="text-rose-500/50 hover:text-rose-300 p-1 transition-colors"
                          title="Delete milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
