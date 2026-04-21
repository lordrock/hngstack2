export default function Sidebar({ theme, toggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">◆</div>

      <div className="sidebar__bottom">
        <button
          className="sidebar__theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="sidebar__avatar">OI</div>
      </div>
    </aside>
  );
}