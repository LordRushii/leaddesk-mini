"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  LogOut,
  TrendingUp,
  ChevronDown,
  Inbox,
  MoreHorizontal,
  CheckCircle2,
  ArrowUpDown,
  Users,
  LayoutDashboard,
  UserPlus,
  Shield,
  Loader2,
  X,
  Mail,
  Lock,
  User as UserIcon,
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
import { logoutUser, createAdminUser, listAdminUsers, AuthenticatedUser } from "@/lib/auth";

type DashboardTab = "leads" | "users";
type DashboardViewMode = "data" | "skeleton" | "empty";

interface AdminUserDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: number;
}

// Initial/Mock Leads
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

export function AdminDashboard({ initialUser }: { initialUser: AuthenticatedUser }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("leads");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<DashboardViewMode>("data");
  const [statusMenuOpenId, setStatusMenuOpenId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // User details state (storing in admin view)
  const [adminUsers, setAdminUsers] = useState<AdminUserDetail[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listAdminUsers().then((result) => {
      if (cancelled) return;
      if (result.success) {
        setAdminUsers(result.users);
      } else {
        setUsersError(result.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Modal State for adding new admin
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("Admin");
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
    router.push("/admin/login");
    router.refresh();
  };

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

  // Define lead columns
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

  const finalLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const table = useReactTable({
    data: finalLeads,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Handle Add Admin User submit
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setIsSubmittingUser(true);

    try {
      const res = await createAdminUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      });

      if (res.success && res.user) {
        setAdminUsers((prev) => [...prev, { _id: res.user.id, name: res.user.name, email: res.user.email, role: res.user.role, createdAt: res.user.createdAt }]);
        setIsAddUserOpen(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
      } else {
        setAddUserError(res.error || "Failed to add admin user");
      }
    } catch (err) {
      setAddUserError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmittingUser(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-3.5 h-3.5 bg-foreground" />
              <span className="font-semibold text-sm tracking-tight text-foreground">
                LeadDesk
              </span>
            </Link>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 ml-4 border-l border-border pl-6">
              <button
                onClick={() => setActiveTab("leads")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer",
                  activeTab === "leads"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Leads Overview
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer",
                  activeTab === "users"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="w-3.5 h-3.5" />
                Admin Accounts ({adminUsers.length})
              </button>
            </nav>

            {/* Global Search */}
            {activeTab === "leads" && (
              <div className="hidden md:flex relative w-64 ml-4">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1 rounded-md text-xs bg-secondary/50 border-transparent focus:border-border focus:bg-card outline-none transition-all placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-border pr-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-foreground leading-none">
                  {initialUser.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {initialUser.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Logout"
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <>
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">Leads</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track your inbound agency inquiries.
                </p>
              </div>

              {/* Debug View Switcher */}
              <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-md border border-border text-xs">
                {(["data", "skeleton", "empty"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-2.5 py-1 rounded font-medium capitalize cursor-pointer",
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
                  <span className="text-3xl font-semibold text-foreground font-mono">
                    {leads.length}
                  </span>
                  <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-500">
                    <TrendingUp className="w-3 h-3 mr-1" /> Active
                  </span>
                </div>
              </div>
              <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  New Leads
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground font-mono">
                    {leads.filter((l) => l.status === "New").length}
                  </span>
                </div>
              </div>
              <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Closed Deals
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground font-mono">
                    {leads.filter((l) => l.status === "Closed").length}
                  </span>
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
                        "px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer",
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
          </>
        )}

        {/* ADMIN USERS TAB */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Admin Users & Details
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View registered administrator accounts stored in Convex database.
                </p>
              </div>

              <button
                onClick={() => setIsAddUserOpen(true)}
                className="px-3.5 py-2 bg-foreground text-background rounded-md text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Add Admin Account
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              {usersError && <p className="px-5 py-3 text-xs text-destructive border-b border-border">{usersError}</p>}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/50 border-b border-border text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 font-medium">User Name</th>
                      <th className="px-5 py-3 font-medium">Email Address</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Joined Date</th>
                      <th className="px-5 py-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {adminUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border bg-secondary border-border text-foreground">
                            <Shield className="w-3 h-3 text-emerald-500" />
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {u.email === initialUser.email ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active Session
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                              Registered
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Admin User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddUserOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Create Admin Account
            </h2>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add a new administrator to manage the LeadDesk Mini dashboard.
            </p>

            {addUserError && (
              <div className="mb-4 p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {addUserError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-secondary/30 border border-border rounded-md focus:outline-none focus:border-foreground transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1 uppercase tracking-wider">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="alex@leaddesk.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-secondary/30 border border-border rounded-md focus:outline-none focus:border-foreground transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-secondary/30 border border-border rounded-md focus:outline-none focus:border-foreground transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1 uppercase tracking-wider">
                  Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-secondary/30 border border-border rounded-md focus:outline-none focus:border-foreground transition-all text-foreground"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-4 py-1.5 bg-foreground text-background rounded-md text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingUser ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
