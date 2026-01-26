import { Comment } from "./comment";
import { CommentsForm } from "./comments-form";

export const Comments = () => {
  return (
    <div className="mt-6">
      <h3 className="font-dm-sans font-bold text-xl">Komentarze</h3>
      <Comment />
      <Comment />
      <CommentsForm />
    </div>
  );
};
