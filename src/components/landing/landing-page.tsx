"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, Info } from "lucide-react";
import { leadSchema, type LeadFormData, budgetRanges } from "@/lib/validations/lead";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// --- Form Field Wrapper Primitive ---
function FormField({
  label,
  error,
  children,
  id,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-foreground">
          {label}
        </label>
        {error && (
          <span className="text-[11px] font-medium text-destructive flex items-center gap-1">
            <Info className="w-3 h-3" />
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// --- Main Landing Page Component ---
export function LandingPage() {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createLead = useMutation(api.leads.createLead);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      budget: undefined,
    },
  });

  const selectedBudget = watch("budget");

  const onSubmit = async (data: LeadFormData) => {
    setSubmitState("loading");
    setSubmitError(null);
    try {
      await createLead({
        name: data.name,
        email: data.email,
        budgetRange: data.budget,
        message: data.message,
      });
      setSubmitState("success");
      reset();
      setTimeout(() => setSubmitState("idle"), 4000);
    } catch (error) {
      setSubmitState("error");
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your request");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-foreground" />
            <span className="font-bold text-sm tracking-tight">LeadDesk</span>
          </div>
          <a
            href="/admin"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin Sign In
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
        {/* Left Column: Hero & Value Prop */}
        <motion.div
          className="lg:col-span-6 space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Capture high-intent clients before they go elsewhere.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              A frictionless lead intake engine designed for digital agencies. Qualify prospects instantly, sync with your CRM, and never miss a high-budget project again.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs text-muted-foreground mt-1 shrink-0">01</span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Zero-friction intake</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Fast, accessible forms that convert traffic into actionable pipeline.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs text-muted-foreground mt-1 shrink-0">02</span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Strict qualification</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Filter out noise immediately with clear budget constraints and requirements.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs text-muted-foreground mt-1 shrink-0">03</span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Real-time admin sync</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Leads hit your dashboard instantly for rapid team response.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Lead Form */}
        <motion.div
          className="lg:col-span-5 lg:col-start-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-card border border-border p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Request an Agency Proposal</h2>
              <p className="text-sm text-muted-foreground mt-1">Tell us about your project goals.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FormField label="Full Name" id="name" error={errors.name?.message}>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-transparent border rounded-none transition-colors placeholder:text-muted-foreground/50",
                    errors.name ? "border-destructive focus-visible:outline-destructive" : "border-border focus-visible:border-primary"
                  )}
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
              </FormField>

              <FormField label="Work Email" id="email" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-transparent border rounded-none transition-colors placeholder:text-muted-foreground/50",
                    errors.email ? "border-destructive focus-visible:outline-destructive" : "border-border focus-visible:border-primary"
                  )}
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
              </FormField>

              <FormField label="Estimated Budget" id="budget" error={errors.budget?.message}>
                <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="budget-label">
                  <span id="budget-label" className="sr-only">Select your estimated budget</span>
                  {budgetRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => setValue("budget", range.value, { shouldValidate: true })}
                      className={cn(
                        "px-3 py-2 text-[13px] border rounded-none text-center transition-colors font-medium",
                        selectedBudget === range.value
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent border-border text-foreground hover:border-foreground/40"
                      )}
                      aria-pressed={selectedBudget === range.value}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {/* Hidden input to register the budget field */}
                <input type="hidden" {...register("budget")} />
              </FormField>

              <FormField label="Project Details" id="message" error={errors.message?.message}>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="What are the key objectives and timeline?"
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-transparent border rounded-none transition-colors placeholder:text-muted-foreground/50 resize-y",
                    errors.message ? "border-destructive focus-visible:outline-destructive" : "border-border focus-visible:border-primary"
                  )}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                />
              </FormField>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitState === "loading" || submitState === "success"}
                  className="w-full h-10 bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {submitState === "idle" && (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Submit Request <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                    {submitState === "loading" && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing
                      </motion.div>
                    )}
                    {submitState === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-background"
                      >
                        <Check className="w-4 h-4" /> Received
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                {submitState === "error" && submitError && (
                  <p className="mt-2 text-xs text-destructive" role="alert">
                    {submitError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 LeadDesk. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Built for</span>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline underline-offset-4"
            >
              Digital Heroes Training Task
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
