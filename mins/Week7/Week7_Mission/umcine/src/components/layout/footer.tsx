export function Footer({ logoSrc = "/images/logos/tmdb-logo.svg" }: { logoSrc?: string }) {
  return (
    <footer className="flex w-full flex-wrap items-center justify-end gap-2 border-t border-[#e3e6eb] bg-white px-5 py-4 sm:px-10 lg:px-20">
      <img className="block h-auto w-6" src={logoSrc} alt="TMDB" />
      <p className="m-0 text-xs text-[#606774]">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a className="text-inherit" href="https://www.themoviedb.org/?language=ko">
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
