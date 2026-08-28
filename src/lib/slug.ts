import { customAlphabet } from 'nanoid';

// no ambiguous chars (0/O, 1/l/I) — these get typed by hand off a card sometimes
const alphabet = '23456789abcdefghjkmnpqrstuvwxyz';
export const generateSlug = customAlphabet(alphabet, 8);