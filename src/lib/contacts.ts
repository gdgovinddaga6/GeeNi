export type Contact = {
  name: string;
  /** E.164, used for tel: links */
  phone: string;
};

export const contacts: Contact[] = [
  { name: 'Ashok Kumar Ji Daga', phone: '+919441013301' },
  { name: 'Manoj Ji Bang', phone: '+919885441501' },
  { name: 'Kailash Ji Bang', phone: '+919849526036' },
  { name: 'Anup Ji Ladha', phone: '+919830454053' },
];

/** "+91 98495 26036" */
export function formatPhone(phone: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(phone);
  return match ? `+91 ${match[1]} ${match[2]}` : phone;
}
