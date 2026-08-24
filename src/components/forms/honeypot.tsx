export const Honeypot = () => (
  <input
    type="text"
    name="hp"
    tabIndex={-1}
    autoComplete="off"
    className="hidden"
    aria-hidden="true"
  />
);
