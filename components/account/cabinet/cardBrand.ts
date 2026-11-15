/** A card network's code as people write it: "visa" → "Visa", "amex" → "American Express". */
export function cardBrand(brand: string): string {
  const known: Record<string, string> = {
    amex: "American Express",
    diners: "Diners Club",
    discover: "Discover",
    jcb: "JCB",
    mastercard: "Mastercard",
    unionpay: "UnionPay",
    visa: "Visa",
  };

  return known[brand] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}
