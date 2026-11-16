// Standard language colours (from GitHub Linguist).
const COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", "C#": "#178600", Go: "#00ADD8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  HTML: "#e34c26", CSS: "#563d7c", SCSS: "#c6538c", Shell: "#89e051", Vue: "#41b883",
  Svelte: "#ff3e00", "Jupyter Notebook": "#DA5B0B", Solidity: "#AA6746", Lua: "#000080",
  R: "#198CE7", Scala: "#c22d40", Elixir: "#6e4a7e", Haskell: "#5e5086", MDX: "#fcb32c",
  Dockerfile: "#384d54", PowerShell: "#012456", "Objective-C": "#438eff", Astro: "#ff5a03",
};

export function langColor(lang) {
  return COLORS[lang] || "#8b949e";
}
