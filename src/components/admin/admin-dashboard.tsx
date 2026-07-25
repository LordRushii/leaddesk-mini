"use me";
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  LogOut,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp,
  Inbox,
  MoreHorizontal,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/validations/lead";

type DashboardViewMode = "data" | "skeleton" | "empty";

// Mock Data
const INITIAL_LEADS: Lead[] = [
  {
    id: "LD-001",
    name: "Elena Rostova",
    email: "elena@vanguarddigital.io",
    budget: "50k+",
    status: "New",
    createdAt: "2026-07-25",
    message: "Looking for an end-to-end agency partner for our Q4 SaaS rebranding.",
  },
  {
    id: "LD-002",
    name: "Marcus Vance",
    email: "m.vance@apexcreative.co",
    budget: "25k-50k",
    status: "Contacted",
    createdAt: "2026-07-24",
    message: "We need custom conversion rate optimization.",
  },
  {
    id: "LD-003",
    name: "Sophia Lin",
    email: "sophia@nexuslabs.dev",
    budget: "10k-25k",
    status: "Closed",
    createdAt: "2026-07-22",
    message: "Retainer agreement signed for full stack web development.",
  },
];

const columnHelper = createColumnHelper<Lead>();

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<DashboardViewMode>("data");
  const [statusMenuOpenId, setStatusMenuOpenId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Toggle lead status
  const cycleStatus = (id: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setStatusMenuOpenId(null);
  };

  const getStatusBadgeStyle = (status: Lead["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      case "Contacted":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-900";
      case "Closed":
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800";
    }
  };

  // Define table columns using TanStack Table helpers
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Lead ID",
        cell: (info) => (
          <span className="text-xs font-mono text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            Name
            <ArrowUpDown className="w-3 h-3 opacity-60" />
          </button>
        ),
        cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("email", {
        header: "Work Email",
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("budget", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            Budget
            <ArrowUpDown className="w-3 h-3 opacity-60" />
          </button>
        ),
        cell: (info) => <span className="font-mono text-xs text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            Date
            <ArrowUpDown className="w-3 h-3 opacity-60" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            Status
            <ArrowUpDown className="w-3 h-3 opacity-60" />
          </button>
        ),
        cell: (info) => {
          const status = info.getValue();
          const rowId = info.row.original.id;
          return (
            <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setStatusMenuOpenId(statusMenuOpenId === rowId ? null : rowId)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium font-mono uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity",
                  getStatusBadgeStyle(status)
                )}
              >
                {status}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>

              {statusMenuOpenId === rowId && (
                <div className="absolute top-full left-0 mt-1 w-32 rounded-md bg-popover border border-border shadow-lg p-1 z-50">
                  {(["New", "Contacted", "Closed"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => cycleStatus(rowId, st)}
                      className="w-full text-left px-2 py-1.5 rounded text-xs font-medium flex items-center justify-between hover:bg-secondary transition-colors text-foreground"
                    >
                      {st}
                      {status === st && <CheckCircle2 className="w-3 h-3 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: () => (
          <div className="text-right">
            <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
    ],
    [statusMenuOpenId]
  );

  // Filtered data based on status pill select & search query
  const finalLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  // Initialize TanStack Table instance
  const table = useReactTable({
    data: finalLeads,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      {/* Top Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-3.5 h-3.5 bg-foreground" />
              <span className="font-semibold text-sm tracking-tight text-foreground">
                LeadDesk
              </span>
            </Link>

            {/* Global Search */}
            <div className="hidden md:flex relative w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-md text-sm bg-secondary/50 border-transparent focus:border-border focus:bg-card focus:ring-0 outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-border pr-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-foreground">Admin User</span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your inbound agency inquiries.
            </p>
          </div>

          {/* Debug View Switcher (Hidden in actual prod, here for requirements) */}
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-md border border-border text-xs">
            {(["data", "skeleton", "empty"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-2.5 py-1 rounded font-medium capitalize",
                  viewMode === mode
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Leads
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground font-mono">142</span>
              <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-500">
                <TrendingUp className="w-3 h-3 mr-1" /> 18%
              </span>
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              New This Week
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground font-mono">28</span>
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contacted Rate
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground font-mono">62%</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="px-5 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-secondary/30">
            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Filter Status:</span>
              {["All", "New", "Contacted", "Closed"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-all",
                    statusFilter === status
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {finalLeads.length} items
            </span>
          </div>

          <div className="overflow-x-auto table-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 border-b border-border text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-5 py-3 font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border/60">
                {/* SKELETON STATE */}
                {viewMode === "skeleton" &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-4">
                        <div className="h-4 w-12 bg-border/50 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-24 bg-border/50 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-32 bg-border/50 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-16 bg-border/50 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-20 bg-border/50 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-20 bg-border/50 rounded-full" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="h-4 w-4 bg-border/50 rounded ml-auto" />
                      </td>
                    </tr>
                  ))}

                {/* EMPTY STATE */}
                {(viewMode === "empty" || (viewMode === "data" && finalLeads.length === 0)) && (
                  <tr>
                    <td colSpan={7} className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Inbox className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm font-medium text-foreground">No leads found</p>
                        <p className="text-xs mt-1">
                          Adjust your search or wait for new submissions.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* DATA STATE */}
                {viewMode === "data" &&
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-secondary/30 transition-colors group cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-5 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
