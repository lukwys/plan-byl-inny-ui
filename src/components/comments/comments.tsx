import { PublicCommentModel } from "@/types/comments";
import { Comment } from "./comment";
import { CommentsForm } from "./comments-form";

type CommentsProps = {
  comments: PublicCommentModel[];
  postDocumentId: string;
};

export const Comments = ({ comments, postDocumentId }: CommentsProps) => {
  return (
    <div className="mt-6">
      <h3 className="font-dm-sans font-bold text-xl">Komentarze</h3>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Comment key={comment.documentId} comment={comment} />
        ))
      ) : (
        <p className="text-sm text-neutral-500 my-5">
          Zapraszam do dyskusji 🙂
        </p>
      )}
      <CommentsForm postDocumentId={postDocumentId} />
    </div>
  );
};
