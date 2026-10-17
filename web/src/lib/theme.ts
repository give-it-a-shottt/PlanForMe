export const SETTINGS_KEY = "planforme-settings";

/** 첫 화면 깜빡임 없이 다크모드를 적용하는 인라인 스크립트 (layout의 <head>에서 실행) */
export const themeScript = `try{var s=JSON.parse(localStorage.getItem("${SETTINGS_KEY}")||"{}");if(s.dark)document.documentElement.classList.add("dark")}catch(e){}`;
