interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function getFromCache<T>(
  key: string,
  expirationMinutes: number = 5
): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const item: CacheItem<T> = JSON.parse(cached);
  const now = new Date().getTime();
  const expirationTime = expirationMinutes * 60 * 1000;

  if (now - item.timestamp > expirationTime) {
    localStorage.removeItem(key);
    return null;
  }

  return item.data;
}

export function saveToCache<T>(key: string, data: T): void {
  const item: CacheItem<T> = {
    data,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(key, JSON.stringify(item));
}
