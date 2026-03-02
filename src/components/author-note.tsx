type AuthorNoteProps = {
  children: string;
};

export const AuthorNote = ({ children }: AuthorNoteProps) => {
  return (
    <aside className="my-12 p-10 bg-white/40 backdrop-blur-[2px] border border-slate-200/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] rounded-[2rem] italic text-slate-600 font-eb-garamond leading-relaxed text-center relative">
      <span className="text-lg md:text-xl block max-w-2xl mx-auto">
        {children.replace("::: ", "")}
      </span>
    </aside>
  );
};
