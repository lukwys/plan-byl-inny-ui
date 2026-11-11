type PageTitleProps = {
  children?: string | null;
  fallback: string;
};

export const PageTitle = ({ children, fallback }: PageTitleProps) => {
  if (!children) {
    return <h1 className="sr-only">{fallback}</h1>;
  }

  return (
    <h1 className="font-dm-sans font-semibold text-3xl leading-tight text-balance mb-10 md:text-4xl">
      {children}
    </h1>
  );
};
