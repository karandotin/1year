"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, Plus, Image as ImageIcon, X, Trash2, Camera, Upload, Eye } from "lucide-react";

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  category: "all" | "dates" | "adventures" | "cozy" | "favorites";
  hearts: number;
  rotation: number;
}

const defaultPhotos: PhotoItem[] = [
  {
    id: "p1",
    url: "/1.jpg",
    caption: "The way you look at me melts everything.",
    date: "",
    category: "dates",
    hearts: 28,
    rotation: -2,
  },
  {
    id: "p2",
    url: "/2.jpg",
    caption: "Holding your hand will always be my favorite thing.",
    date: "",
    category: "cozy",
    hearts: 42,
    rotation: 2.5,
  },
  {
    id: "p3",
    url: "/3.jpg",
    caption: "Golden hour with the one who brings sunshine into my life.",
    date: "",
    category: "adventures",
    hearts: 56,
    rotation: -1.5,
  },
  {
    id: "p4",
    url: "/4.jpg",
    caption: "Laughing at nothing and everything with you.",
    date: "",
    category: "favorites",
    hearts: 39,
    rotation: 3,
  },
  {
    id: "p5",
    url: "/5.jpg",
    caption: "Stargazing and dreaming about our forever.",
    date: "",
    category: "cozy",
    hearts: 64,
    rotation: -2.8,
  },
  {
    id: "p6",
    url: "/6.jpg",
    caption: "365 days of us, and I would choose you all over again.",
    date: "",
    category: "favorites",
    hearts: 99,
    rotation: 1.2,
  },
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>(defaultPhotos);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New photo upload state
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState<"dates" | "adventures" | "cozy" | "favorites">("favorites");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("anniversary_photos");
      if (saved) {
        setPhotos(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const savePhotos = (updated: PhotoItem[]) => {
    setPhotos(updated);
    try {
      localStorage.setItem("anniversary_photos", JSON.stringify(updated));
    } catch {}
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photos.map((p) => (p.id === id ? { ...p, hearts: p.hearts + 1 } : p));
    savePhotos(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this photo?")) {
      const updated = photos.filter((p) => p.id !== id);
      savePhotos(updated);
      if (activePhoto?.id === id) setActivePhoto(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedPreview) return;

    const newPhoto: PhotoItem = {
      id: "photo_" + Date.now(),
      url: uploadedPreview,
      caption: newCaption.trim() || "A moment I'll cherish forever.",
      date: newDate.trim() || "Special Memory",
      category: newCategory,
      hearts: 1,
      rotation: (Math.random() - 0.5) * 6,
    };

    const updated = [newPhoto, ...photos];
    savePhotos(updated);
    setShowUploadModal(false);
    setUploadedPreview(null);
    setNewCaption("");
    setNewDate("");
  };

  const filteredPhotos =
    selectedFilter === "all" ? photos : photos.filter((p) => p.category === selectedFilter);

  return (
    <section id="gallery" className="py-20 px-4 relative max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs uppercase tracking-widest font-semibold mb-3">
          <Camera className="w-3.5 h-3.5 text-rose-400" />
          <span>Captured In Time</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Our Polaroid <span className="text-glow text-rose-400">Memory Wall</span>
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Every snapshot tells a chapter of our love story. Click any photo to see it up close or tap the heart to shower some love!
        </p>

        {/* Action Controls: Filter tabs & Upload Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="flex flex-wrap gap-1.5 p-1 bg-rose-950/50 rounded-2xl border border-rose-500/30 backdrop-blur-md">
            {[
              { id: "all", label: "All Photos" },
              { id: "dates", label: "Dates ☕" },
              { id: "adventures", label: "Adventures ✈️" },
              { id: "cozy", label: "Cozy Moments 🌙" },
              { id: "favorites", label: "Favorites 💖" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedFilter === tab.id
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
                    : "text-rose-300/80 hover:text-white hover:bg-rose-900/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Add Our Real Photos</span>
          </button>
        </div>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 pt-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            style={{ transform: `rotate(${photo.rotation}deg)` }}
            className="polaroid relative cursor-pointer group flex flex-col"
          >
            {/* Washi Tape at Top */}
            <div className="washi-tape" />

            {/* Photo Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 rounded-sm mb-3">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-rose-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                  <Eye className="w-5 h-5 text-rose-300" />
                </span>
              </div>
            </div>

            {/* Handwritten Caption & Date */}
            <div className="px-1 text-center font-serif text-neutral-800">
              <p className="text-sm font-medium leading-snug line-clamp-2">
                &ldquo;{photo.caption}&rdquo;
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 italic font-sans">{photo.date}</p>
            </div>

            {/* Bottom Heart & Delete Bar */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200 text-xs">
              <button
                onClick={(e) => handleLike(photo.id, e)}
                className="flex items-center gap-1.5 text-rose-600 font-semibold px-2 py-0.5 rounded-full hover:bg-rose-50 transition-colors"
                title="Send love"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 hover:scale-125 transition-transform" />
                <span>{photo.hearts}</span>
              </button>

              <button
                onClick={(e) => handleDelete(photo.id, e)}
                className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#1b0612] border border-rose-500/40 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-white">&ldquo;{activePhoto.caption}&rdquo;</p>
                <p className="text-xs text-rose-300/80 mt-1">{activePhoto.date}</p>
              </div>

              <button
                onClick={(e) => handleLike(activePhoto.id, e)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Love This Moment ({activePhoto.hearts})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1c0613] border border-rose-500/40 p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-rose-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" /> Add Your Special Picture
            </h3>
            <p className="text-xs text-rose-200/70 mb-4">
              Upload photos of you two! They will be saved right on this website.
            </p>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              {/* Image Input / Drop area */}
              <div className="border-2 border-dashed border-rose-500/40 rounded-2xl p-4 text-center hover:border-rose-400 transition-colors bg-rose-950/30">
                {uploadedPreview ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                    <img
                      src={uploadedPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedPreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                    <Camera className="w-10 h-10 text-rose-400 mb-2 animate-bounce" />
                    <span className="text-sm font-semibold text-rose-200">
                      Click to choose an image from device
                    </span>
                    <span className="text-xs text-rose-400/60 mt-1">PNG, JPG, WEBP up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="text-xs text-rose-300 block mb-1">Caption / Sweet Memory</label>
                <input
                  type="text"
                  placeholder="e.g. The day we got caught in the rain together..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-rose-300 block mb-1">Date / Place</label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-rose-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-rose-950/70 border border-rose-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                  >
                    <option value="favorites">💖 Favorites</option>
                    <option value="dates">☕ Dates</option>
                    <option value="adventures">✈️ Adventures</option>
                    <option value="cozy">🌙 Cozy Moments</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!uploadedPreview}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all"
              >
                Save to Polaroid Wall
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
