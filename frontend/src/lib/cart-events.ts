/** Tiny pub/sub so any cart mutation (add, update quantity, remove) can tell
 * the Header to refetch its badge count, without a global state library. */
export const CART_UPDATED_EVENT = "cart:updated";

export function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}
