/**
 * Session Capacity Calculation Helper Utilities
 * Patterned after attachDynamicPricing
 */

/**
 * Calculates remainingCapacity and isFull for a single session object or document
 * - remainingCapacity = capacity - enrolledCount (or null if capacity is null/undefined)
 * - isFull = remainingCapacity <= 0 (always false if capacity is null/undefined)
 */
export function computeSessionCapacity(session) {
  if (!session) return { remainingCapacity: null, isFull: false };

  const raw = typeof session.toObject === "function" ? session.toObject() : session;
  const capacity =
    raw.capacity != null && raw.capacity !== "" && !isNaN(Number(raw.capacity))
      ? Number(raw.capacity)
      : null;
  const enrolledCount = Math.max(0, Number(raw.enrolledCount) || 0);

  if (capacity != null && capacity >= 0) {
    const remainingCapacity = Math.max(0, capacity - enrolledCount);
    const isFull = remainingCapacity <= 0;
    return {
      remainingCapacity,
      isFull,
    };
  }

  // Unlimited capacity (capacity is null or undefined)
  return {
    remainingCapacity: null,
    isFull: false,
  };
}

/**
 * Attaches computed capacity fields (remainingCapacity, isFull) to session document(s)
 * Supports either an array of sessions or a single session object.
 */
export function attachSessionCapacity(sessions) {
  if (!sessions) return sessions;

  if (Array.isArray(sessions)) {
    return sessions.map((sess) => {
      const raw = typeof sess.toObject === "function" ? sess.toObject() : { ...sess };
      const capacityInfo = computeSessionCapacity(raw);
      return {
        ...raw,
        ...capacityInfo,
      };
    });
  }

  const raw = typeof sessions.toObject === "function" ? sessions.toObject() : { ...sessions };
  const capacityInfo = computeSessionCapacity(raw);
  return {
    ...raw,
    ...capacityInfo,
  };
}
