import { CategoryModel } from "@/types/category";
import Link from "next/link";
import { formatDate } from "@/lib/dates/format-date";

type PostInfoProps = {
  category?: CategoryModel;
  date: string;
  align?: "center" | "start";
};

export const PostInfo = ({ category, date, align = "center" }: PostInfoProps) => {
  return (
    <div
      className={`flex gap-1 text-xs ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      {category && (
        <>
          <Link
            href={`/kategoria/${category.slug}`}
            className="relative z-10 text-main-red hover:text-main-red-hover"
          >
            <p>{category.name.toUpperCase()}</p>
          </Link>
          <p>•</p>
        </>
      )}
      <p>{formatDate(date)}</p>
    </div>
  );
};
