import { useTheme } from "../contexts/ThemeContext";

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside
      className="
        fixed z-50
        top-0 left-0 right-0 h-[72px]
        lg:right-auto lg:bottom-0 lg:w-[88px] lg:h-full
        bg-[#373B53]
        flex flex-row items-center justify-between
        lg:flex-col
        lg:rounded-r-[20px]
      "
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div
        className="relative w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] bg-purple flex items-center justify-center rounded-br-[20px] lg:rounded-br-none lg:rounded-r-[20px] overflow-hidden cursor-pointer shrink-0"
        aria-label="Invoice App"
        role="img"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[36px] lg:h-[44px] bg-purple-light rounded-tl-[20px]" />
        <svg
          className="relative z-10"
          width="28"
          height="26"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
            fill="#fff"
          />
        </svg>
      </div>

      {/* Controls */}
      <div className="flex flex-row items-center gap-6 pr-6 lg:flex-col lg:pr-0 lg:pb-6">
        <button
          onClick={toggleTheme}
          className="text-blue-muted hover:text-white transition-colors p-2 rounded-lg"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* vertical line on mobile header, horizontal line on desktop sidebar */}
        <div
          className="w-px h-6 bg-[#494E6E] lg:w-full lg:h-px"
          aria-hidden="true"
        />

        <div
          className="w-8 h-8 rounded-full bg-[#696ADD] flex items-center justify-center text-white text-xs font-bold"
          aria-label="User avatar"
          role="img"
        >
          <img src="/user.svg" alt="User avatar" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
