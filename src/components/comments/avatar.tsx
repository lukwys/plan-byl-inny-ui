import { getInitials } from "@/lib/comments/get-initials";
import { getAvatarColor } from "@/lib/comments/get-avatar-color";

type AvatarProps = {
  name: string;
};

export const Avatar = ({ name }: AvatarProps) => {
  const initials = getInitials(name);
  const background = getAvatarColor(name);

  return (
    <div
      className="grid place-items-center rounded-full text-white font-semibold w-15 h-15"
      style={{ background }}
      aria-hidden="true"
      title={name}
    >
      {initials}
    </div>
  );
};
