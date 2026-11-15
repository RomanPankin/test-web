/** Two letters for an avatar: the name's initials, or the email's first letter. */
export function initialsOf(name: string | null, email: string): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return email.slice(0, 1).toUpperCase();
}
