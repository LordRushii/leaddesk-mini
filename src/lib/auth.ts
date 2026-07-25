"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { getSessionCookie, removeSessionCookie, setSessionCookie } from "./cookies";
import { generateSessionToken } from "./session";
import { hashPassword, verifyPassword } from "./password";
import { Id } from "../../convex/_generated/dataModel";
import { loginSchema, registerSchema } from "./validations/auth";

const getConvexClient = () => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set in environment variables.");
  }
  return new ConvexHttpClient(convexUrl);
};

export interface AuthenticatedUser {
  id: Id<"users">;
  name: string;
  email: string;
  role: string;
  createdAt: number;
}

const SESSION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { name, email, password, role } = parsed.data;

  try {
    const convex = getConvexClient();
    const existingUser = await convex.query(api.users.getUserByEmail, { email });
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const passwordHash = await hashPassword(password);
    const createdAt = Date.now();

    const userId = await convex.mutation(api.users.createUser, {
      name,
      email,
      passwordHash,
      role: role || "Admin",
      createdAt,
    });

    const sessionToken = generateSessionToken();
    const expiresAt = Date.now() + SESSION_EXPIRATION_MS;

    await convex.mutation(api.sessions.createSession, {
      userId,
      sessionToken,
      expiresAt,
      createdAt,
    });

    await setSessionCookie(sessionToken, expiresAt);

    return {
      success: true,
      user: {
        id: userId,
        name,
        email,
        role: role || "Admin",
        createdAt,
      },
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to register user" };
  }
}

export async function listAdminUsers() {
  const currentUser = await getSessionUser();
  if (!currentUser) return { success: false as const, error: "Not authenticated" };

  try {
    const users = await getConvexClient().query(api.users.listUsers, {});
    return { success: true as const, users };
  } catch (err) {
    console.error("Failed to load admin users:", err);
    return { success: false as const, error: "Failed to load admin users" };
  }
}

export async function createAdminUser(input: unknown) {
  const currentUser = await getSessionUser();
  if (!currentUser) return { success: false as const, error: "Not authenticated" };

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  try {
    const { name, email, password, role } = parsed.data;
    const convex = getConvexClient();
    const passwordHash = await hashPassword(password);
    const createdAt = Date.now();
    const id = await convex.mutation(api.users.createUser, {
      name,
      email,
      passwordHash,
      role: role || "Admin",
      createdAt,
    });

    return {
      success: true as const,
      user: { id, name, email: email.toLowerCase().trim(), role: role || "Admin", createdAt },
    };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Failed to create admin user" };
  }
}

export async function loginUser(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  try {
    const convex = getConvexClient();

    const user = await convex.query(api.users.getUserByEmail, { email });
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return { success: false, error: "Invalid email or password" };
    }

    const sessionToken = generateSessionToken();
    const expiresAt = Date.now() + SESSION_EXPIRATION_MS;

    await convex.mutation(api.sessions.createSession, {
      userId: user._id,
      sessionToken,
      expiresAt,
      createdAt: Date.now(),
    });

    await setSessionCookie(sessionToken, expiresAt);

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Login failed" };
  }
}

export async function logoutUser() {
  try {
    const token = await getSessionCookie();
    if (token) {
      const convex = getConvexClient();
      await convex.mutation(api.sessions.deleteSession, { sessionToken: token });
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    await removeSessionCookie();
  }
  return { success: true };
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  try {
    const token = await getSessionCookie();
    if (!token) return null;

    const convex = getConvexClient();
    const session = await convex.query(api.sessions.getSession, { sessionToken: token });

    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        await convex.mutation(api.sessions.deleteSession, { sessionToken: token });
      }
      await removeSessionCookie();
      return null;
    }

    const user = await convex.query(api.users.getUserById, { id: session.userId });
    if (!user) return null;

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (err) {
    console.error("Error retrieving session user:", err);
    return null;
  }
}
