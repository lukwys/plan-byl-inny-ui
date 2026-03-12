import { CategoryModel } from "@/types/category";
import Link from "next/link";
import { formatDate } from "@/lib/dates/format-date";

type PostInfoProps = {
  category?: CategoryModel;
  date: string;
};

export const PostInfo = ({ category, date }: PostInfoProps) => {
  return (
    <div className="flex justify-center gap-1 text-xs">
      <Link
        href={`/kategoria/${category?.slug}`}
        className="text-main-red hover:text-main-red-hover"
      >
        <p>{category?.name.toUpperCase()}</p>
      </Link>
      <p>•</p>
      <p>{formatDate(date)}</p>
    </div>
  );
};
