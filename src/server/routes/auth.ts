import {
  toErrorResponse,
  toSuccessfulResponse,
  verifySignature,
} from "@/utils/helpers";
import { LoginAuthZod } from "@/utils/validation";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { db } from "@/db/conn";

const maxAge = 24 * 60 * 60 * 1000; // 1 day

export const route = new Hono();

// POST /auth/login

route.post("/login", async (c) => {
  try {
    const unsafeData = await c.req.json();

    const parsedDataRes = LoginAuthZod.safeParse(unsafeData);

    if (!parsedDataRes.success) {
      return toErrorResponse(c, "Invalid data");
    }

    const { walletPubkey, walletSignature } = parsedDataRes.data;

    const isSigVerified = verifySignature(walletSignature, walletPubkey);
    if (!isSigVerified) {
      return toErrorResponse(c, "Invalid signature");
    }

    // Check if a session already exists for this wallet
    let session = await db.session.findFirst({
      where: { walletSignature, walletPubkey },
    });

    if (session) {
      // If a session exists, update its expiry
      session = await db.session.update({
        where: { id: session.id },
        data: { expiresAt: new Date(Date.now() + maxAge) },
      });
    } else {
      // If no session exists, create a new one
      const expiresAt = new Date(Date.now() + maxAge);

      session = await db.session.create({
        data: { walletSignature, walletPubkey, expiresAt },
      });
    }

    toSuccessfulResponse(c, {
      message: "Logged in successfully",
      walletSignature: session.walletSignature,
      walletPubkey: session.walletPubkey,
    });

    // Set the walletSignature cookie

    setCookie(c, "walletSignature", session.walletSignature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: maxAge / 1000,
    });
  } catch (err) {
    console.error("Login error:", err);
    return toErrorResponse(c, "Error logging in");
  }
});

// POST /auth/check

route.post("/check", async (c) => {
  try {
    const walletSignature = getCookie(c, "walletSignature");
    const { walletPubkey } = await c.req.json();

    if (!walletSignature || !walletPubkey) {
      return toSuccessfulResponse(c, {
        isAuthenticated: false,
        walletSignature: null,
        walletPubkey: null,
      });
    }

    const session = await db.session.findFirst({
      where: { walletSignature, walletPubkey },
    });

    if (!session) {
      return toSuccessfulResponse(c, {
        isAuthenticated: false,
        walletSignature: null,
        walletPubkey: null,
      });
    }

    const isSigVerified = verifySignature(
      session.walletSignature,
      session.walletPubkey
    );
    const currentTime = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (isSigVerified && expiresAt > currentTime) {
      return toSuccessfulResponse(c, {
        isAuthenticated: true,
        walletSignature: session.walletSignature,
        walletPubkey: session.walletPubkey,
        expiresAt: session.expiresAt,
      });
    }

    return toSuccessfulResponse(c, {
      isAuthenticated: false,
      walletSignature: null,
      walletPubkey: null,
    });
  } catch (error) {
    console.error("Auth check failed:", error);
    return toSuccessfulResponse(c, {
      isAuthenticated: false,
      walletSignature: null,
      walletPubkey: null,
    });
  }
});

// POST /auth/logout

route.post("/logout", async (c) => {
  try {
    const walletSignature = getCookie(c, "walletSignature");
    const { walletPubkey } = await c.req.json();

    if (!walletSignature || !walletPubkey) {
      return toErrorResponse(c, "Session not found");
    }

    await db.session.delete({
      where: { walletSignature, walletPubkey },
    });
    console.log("Session deleted successfully");
    deleteCookie(c, "walletSignature");

    return toSuccessfulResponse(c, {
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error deleting session from database:", error);

    return toErrorResponse(c, "Error logging out");
  }
});
