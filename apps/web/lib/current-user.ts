export const bootstrapUserId = "00000000-0000-4000-8000-000000000001";

export function getCurrentUserId(): string {
  return process.env.DOWNTIMED_USER_ID ?? bootstrapUserId;
}
