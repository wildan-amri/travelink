import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const vehicleImageMap: Array<{ keyword: string; url: string }> = [
  { keyword: 'jeep', url: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'atv', url: 'https://images.pexels.com/photos/315386/pexels-photo-315386.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'jetski', url: 'https://images.pexels.com/photos/4090140/pexels-photo-4090140.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'jet ski', url: 'https://images.pexels.com/photos/4090140/pexels-photo-4090140.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'honda', url: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'crf', url: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'trail', url: 'https://images.pexels.com/photos/461207/pexels-photo-461207.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'motor', url: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'sepeda', url: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'perahu', url: 'https://images.pexels.com/photos/4507835/pexels-photo-4507835.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'boat', url: 'https://images.pexels.com/photos/4507835/pexels-photo-4507835.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'danau', url: 'https://images.pexels.com/photos/4507835/pexels-photo-4507835.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'rinjani', url: 'https://images.pexels.com/photos/315386/pexels-photo-315386.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'adventure', url: 'https://images.pexels.com/photos/315386/pexels-photo-315386.jpeg?auto=compress&cs=tinysrgb&w=1260' },
  { keyword: 'classic', url: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1260' },
];

const defaultVehicleImage = 'https://images.pexels.com/photos/12065618/pexels-photo-12065618.jpeg?auto=compress&cs=tinysrgb&w=1260';

export function getVehicleImageByName(
  name?: string,
  images?: Array<{ url?: string; isPrimary?: boolean }> | null,
  imageUrl?: string | null,
) {
  if (imageUrl) {
    return imageUrl;
  }

  if (images?.length) {
    const primaryImage = images.find((img) => img.isPrimary && img.url)?.url;
    if (primaryImage) return primaryImage;
    const firstImage = images[0]?.url;
    if (firstImage) return firstImage;
  }

  const title = name?.toLowerCase().trim();
  if (!title) {
    return defaultVehicleImage;
  }
  // Tokenize the title to match whole words first (avoids accidental partial matches)
  const tokens = title.split(/[^a-z0-9]+/).filter(Boolean);

  // Try to match multi-word keywords first, then whole-word tokens, then substring fallback
  // Sort keywords by length desc so longer/more specific keywords have priority
  const sorted = [...vehicleImageMap].sort((a, b) => b.keyword.length - a.keyword.length);

  for (const item of sorted) {
    const key = item.keyword.toLowerCase();
    if (key.includes(' ')) {
      // multi-word keyword: check substring
      if (title.includes(key)) return item.url;
      continue;
    }

    // whole-word token match
    if (tokens.includes(key)) return item.url;

    // substring fallback
    if (title.includes(key)) return item.url;
  }

  return defaultVehicleImage;
}
