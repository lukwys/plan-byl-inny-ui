import { formatDate } from "@/lib/dates/format-date";
import { PublicCommentModel } from "@/types/comments";
import { Avatar } from "./avatar";

type CommentProps = {
  comment: PublicCommentModel;
};

export const Comment = ({ comment }: CommentProps) => {
  const { authorName, body, createdAt } = comment;

  return (
    <div className="flex my-4 w-full gap-10 font-dm-sans">
      <Avatar name={authorName} />
      <div className="flex flex-1 justify-between items-center">
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
