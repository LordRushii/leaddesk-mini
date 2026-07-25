"use me";
"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  DollarSign,
  Sparkles,
  User,
  Mail,
  MessageSquare,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FormVisualState = "interactive" | "default" | "focused" | "error" | "success";
type ButtonState = "idle" | "loading" | "success";

const BUDGET_OPTIONS = [
  { id: "5k-10k", label: "$5k - $10k", sub: "Starter" },
  { id: "10k-25k", label: "$10k - $25k", sub: "Growth" },
  { id: "25k-50k", label: "$25k - $50k", sub: "Scale" },
  { id: "50k+", label: "$50k+", sub: "Enterprise" },
];

export function LeadCaptureForm() {
  // State management
  const [formVisualState, setFormVisualState] = useState<FormVisualState>("interactive");
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form values
  const [formData, setFormData] = useState({
    name: "Alex Rivera",
    email: "alex@digitalheroes.com",
    budget: "10k-25k",
    message: "We need a complete redesign of our agency sales lead pipeline with custom API integrations.",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buttonState !== "idle") return;

    // Trigger loading -> success animation sequence
    setButtonState("loading");
    setTimeout(() => {
      setButtonState("success");
      setFormVisualState("success");
    }, 1800);
  };

  const resetForm = () => {
    setButtonState("idle");
    setFormVisualState("interactive");
    setErrors({});
  };

  // Force active state based on preview selector
  const isForceError = formVisualState === "error";
  const isForceSuccess = formVisualState === "success";
  const isForceFocused = formVisualState === "focused";
  const isForceDefault = formVisualState === "default";

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* State Switcher Bar for Interactive Inspection */}
      <div className="glass-card p-3 rounded-2xl border border-indigo-500/20 bg-slate-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-indigo-400 font-medium px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>UI State Tester</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setFormVisualState("interactive");
              setButtonState("idle");
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-medium",
              formVisualState === "interactive"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            Interactive
          </button>
          <button
            type="button"
            onClick={() => {
              setFormVisualState("default");
              setButtonState("idle");
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-medium",
              isForceDefault
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => {
              setFormVisualState("focused");
              setButtonState("idle");
              setFocusedField("email");
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-medium",
              isForceFocused
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            Focus Glow
          </button>
          <button
            type="button"
            onClick={() => {
              setFormVisualState("error");
              setButtonState("idle");
              setErrors({
                email: "Please enter a valid work email address",
                name: "Full name is required",
              });
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-medium",
              isForceError
                ? "bg-red-600/90 text-white shadow-sm"
                : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            Error State
          </button>
          <button
            type="button"
            onClick={() => {
              setFormVisualState("success");
              setButtonState("success");
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-medium",
              isForceSuccess
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
            )}
          >
            Success State
          </button>
        </div>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 transition-all duration-300">
        {/* Glow ambient background highlight */}
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="mb-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Agency Inquiry Form
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Let&apos;s build your lead engine
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Fill out the form below to request a tailored agency proposal.
          </p>
        </div>

        {/* SUCCESS CONFIRMATION STATE */}
        {isForceSuccess ? (
          <div className="py-8 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 text-slate-950 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Lead Captured Successfully!
              </h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="text-indigo-300 font-semibold">{formData.name || "Alex"}</span>. We have logged your request for the <span className="text-indigo-300 font-semibold">{formData.budget}</span> budget bracket.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 max-w-sm mx-auto space-y-1">
              <div className="flex justify-between">
                <span>Contact Email:</span>
                <span className="text-slate-200 font-mono">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">New Lead (Logged)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-white/10 hover:border-white/20 mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          /* REGULAR FORM INPUTS */
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Field 1: Name */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Full Name
                </span>
                {isForceError && (
                  <span className="text-red-400 text-[11px] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Required
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={isForceDefault ? "" : formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none",
                    "glass-input placeholder:text-slate-500",
                    (focusedField === "name" || isForceFocused) && "glass-input-focused",
                    (errors.name || isForceError) && "glass-input-error"
                  )}
                />
              </div>
              {errors.name && isForceError && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Field 2: Email */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Work Email
                </span>
                {errors.email && (
                  <span className="text-red-400 text-[11px] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Invalid email
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="sarah@agency.com"
                  value={isForceDefault ? "" : formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none",
                    "glass-input placeholder:text-slate-500",
                    (focusedField === "email" || isForceFocused) && "glass-input-focused",
                    (errors.email || isForceError) && "glass-input-error"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Field 3: Budget Range Segmented Control */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                Estimated Project Budget
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BUDGET_OPTIONS.map((opt) => {
                  const isSelected = formData.budget === opt.id && !isForceDefault;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleInputChange("budget", opt.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all duration-200",
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20"
                          : "bg-slate-950/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      <span className="font-bold text-sm">{opt.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{opt.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: Message */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Project Details / Message
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about your agency, key goals, and timeline..."
                value={isForceDefault ? "" : formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none resize-none",
                  "glass-input placeholder:text-slate-500",
                  focusedField === "message" && "glass-input-focused"
                )}
              />
            </div>

            {/* Submit Button with 3 Visual States (Idle, Loading, Success) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={buttonState === "loading"}
                className={cn(
                  "w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group cursor-pointer",
                  buttonState === "idle" &&
                    "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/30 hover:shadow-indigo-500/50 glow-btn border border-indigo-400/30",
                  buttonState === "loading" &&
                    "bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 cursor-wait animate-pulse-subtle",
                  buttonState === "success" &&
                    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/40 shadow-emerald-600/30"
                )}
              >
                {buttonState === "idle" && (
                  <>
                    <span>Submit Lead Request</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}

                {buttonState === "loading" && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                    <span>Processing Submission...</span>
                  </>
                )}

                {buttonState === "success" && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                    <span>Lead Captured!</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
