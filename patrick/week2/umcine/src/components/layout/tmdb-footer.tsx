export function TmdbFooter() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-gray-200 px-12 py-6 text-xs text-gray-500">
      <img src="/images/logos/tmdb-logo-square.png" alt="TMDB" className="h-6 w-6" />
      <p className="m-0">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}