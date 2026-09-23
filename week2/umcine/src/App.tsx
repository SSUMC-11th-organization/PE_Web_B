import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

type StudyMode = "focus" | "break";

const StudyModeContext = createContext<StudyMode>("focus");

const ThemeContext = createContext<Theme>("light");

function ThemeStatus() {
  const theme = useContext(ThemeContext);
  const studyMode = useContext(StudyModeContext);

  return (
    <p>
      현재 테마: {theme}, 스터디 모드: {studyMode}
    </p>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [studyMode, setStudyMode] = useState<StudyMode>("focus");

  function handleToggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return (
    <ThemeContext value={theme}>
      <StudyModeContext value={studyMode}>
        <ThemeStatus />
      </StudyModeContext>
      <button onClick={handleToggleTheme}>
        테마 바꾸기
      </button>
    </ThemeContext>
  );
}