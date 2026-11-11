import { PostModel } from "@/types/post";
import { BlogPost } from "./blog-post";

type PostListProps = {
  posts: PostModel[];
  featureFirst?: boolean;
};

export const PostList = ({ posts, featureFirst = true }: PostListProps) => {
  if (posts.length === 0) return null;

  const [latest, ...rest] = posts;
  const gridPosts = featureFirst ? rest : posts;

  return (
    <div className="flex flex-col gap-14">
      {featureFirst && <BlogPost post={latest} featured />}
      {gridPosts.length > 0 && (
        <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {gridPosts.map((post) => (
            <BlogPost key={post.documentId} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
