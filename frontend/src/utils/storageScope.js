let activeStorageUser = "demo";

export function setActiveStorageUser(userId) {
  activeStorageUser = userId || "demo";
}

export function getActiveStorageUser() {
  return activeStorageUser;
}

export function scopedKey(key, userId = activeStorageUser) {
  return `${key}.${userId || "demo"}`;
}
