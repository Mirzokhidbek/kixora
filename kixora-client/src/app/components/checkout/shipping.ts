export interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
}

/** Returns an error message, or "" when the form is valid (mirrors server validation) */
export function validateShipping(form: ShippingForm): string {
  if (form.fullName.trim().length < 2) return "Please enter the recipient's full name.";
  if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) return "Please enter a valid phone number.";
  if (form.address.trim().length < 5) return "Please enter the full street address.";
  if (!form.city.trim()) return "Please enter the city.";
  return "";
}

/** Single address line stored on the order */
export function formatAddress(form: ShippingForm): string {
  const zip = form.postalCode.trim() ? `, ${form.postalCode.trim()}` : "";
  return `${form.city.trim()}, ${form.address.trim()}${zip}`;
}
