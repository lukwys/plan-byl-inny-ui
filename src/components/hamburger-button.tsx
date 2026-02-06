type HamburgerButtonProps = {
  open: boolean;
  onClick: () => void;
};

export const HamburgerButton = ({ open, onClick }: HamburgerButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      className="relative w-8 h-8 flex items-center justify-center lg:hidden"
    >
      <span
        className={`absolute h-0.5 w-6 bg-black transition-transform duration-300 ${
          open ? "rotate-45" : "-translate-y-2"
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 bg-black transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 bg-black transition-transform duration-300 ${
          open ? "-rotate-45" : "translate-y-2"
        }`}
      />
    </button>
  );
};
