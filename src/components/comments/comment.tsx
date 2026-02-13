import { formatDate } from "@/lib/dates/format-date";
import { PublicCommentModel } from "@/types/comments";

type CommentProps = {
  comment: PublicCommentModel;
};

export const Comment = ({ comment }: CommentProps) => {
  const { authorName, body, createdAt } = comment;

  return (
    <div className="flex my-4 w-full gap-10 font-dm-sans">
      <div className="w-20 h-20 bg-amber-700 rounded-full shrink-0" />
      <div className="flex flex-1 justify-between">
        <div>
          <div className="text-main-red  hover:text-main-red-hover">
            {authorName}
          </div>
          <div>{body}</div>
        </div>
        <div className="text-gray text-[10px]">
          {formatDate(createdAt, "HH:mm, d MMMM yyyy")}
        </div>
      </div>
    </div>
  );
};
