import { PostModel } from "@/types/post";
import { PageTitle } from "./page-title";
import { PostList } from "./post-list";
import { Pagination } from "./pagination";
import { Sidebar } from "./sidebar";

type PostsPageProps = {
  title?: string | null;
  fallbackTitle: string;
  posts: PostModel[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  emptyMessage: string;
};

export const PostsPage = ({
  title,
  fallbackTitle,
  posts,
  currentPage,
  totalPages,
  basePath,
  emptyMessage,
}: PostsPageProps) => (
  <div className="container mx-auto bg-white py-10 grid gap-10 lg:grid-cols-24 px-4 lg:px-0">
    <div className="lg:col-start-2 lg:col-span-15">
      <PageTitle fallback={fallbackTitle}>{title}</PageTitle>
      {posts.length === 0 ? (
        <p className="font-eb-garamond text-xl text-neutral-600">{emptyMessage}</p>
      ) : (
        <PostList posts={posts} featureFirst={currentPage === 1} />
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
    </div>
    <aside className="lg:col-start-18 lg:col-span-6">
      <div className="block lg:hidden h-px bg-neutral-200 my-4" />
      <Sidebar />
    </aside>
  </div>
);
