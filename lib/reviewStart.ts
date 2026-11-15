/**
 * "Write a review with these stars": the rating under a product's name asks the review form at
 * the foot of the page to open, pick that vote and take the cursor - while the shop takes votes
 * only with a comment (`voteNeedsComment`). The two are separate islands, so the ask travels as a
 * browser event.
 */
const EVENT = "techstore:review-start";

export function startReview(vote: number): void {
  window.dispatchEvent(new CustomEvent<number>(EVENT, { detail: vote }));
}

/** Listen for the ask; returns the way to stop listening. */
export function onReviewStart(handler: (vote: number) => void): () => void {
  const listener = (event: Event) =>
    handler((event as CustomEvent<number>).detail);

  window.addEventListener(EVENT, listener);

  return () => window.removeEventListener(EVENT, listener);
}
