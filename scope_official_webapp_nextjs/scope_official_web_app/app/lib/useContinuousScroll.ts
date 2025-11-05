"use client";

// Forwarding shim to the real client implementation.
// This file replaces the corrupted source and re-exports the
// implementation and types from the client-targeted module so
// older imports (../lib/useContinuousScroll) keep working.

export type { UseContinuousScrollOptions } from './useContinuousScroll.client';
export { default } from './useContinuousScroll.client';
