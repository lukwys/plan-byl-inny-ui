export const getInitials = (fullName: string) => {
  const initials = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  return initials.map((part) => part.charAt(0).toUpperCase()).join("");
};
