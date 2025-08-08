// Translation data for multi-language support
const translations = {
    en: {
        title: "Our Location",
        getLocation: "Get Location",
        subtitle: "Navoi region, Old city, opposite the Telegraph",
        footer: "Powered by: modern Nurali Vafoyev",
    },
    uz: {
        title: "Bizning joylashuvimiz",
        getLocation: "Joylashuvni Aniqlash",
        subtitle: "Navoiy viloyati, Eski shahar, Telegraf ro'parasida",
        footer: "Nurali Vafoyev tomonidan yaratildi",
    },
    ru: {
        title: "Наше местоположение",
        getLocation: "Определить Местоположение",
        subtitle: "Навоийская область, Старый город, напротив Телеграфа",
        footer: "Создано Нурали Вафоевым",
    }
};

const switcher = document.getElementById("languageSelect");

switcher.addEventListener("change", () => {
  const lang = switcher.value;
  applyTranslations(lang);
});

function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Sahifa yuklanganda default til
window.addEventListener("DOMContentLoaded", () => {
  const defaultLang = "uz";
  switcher.value = defaultLang;
  applyTranslations(defaultLang);
});
switcher.addEventListener("change", () => {
  const lang = switcher.value;
  applyTranslations(lang);
  localStorage.setItem("lang", lang);  // Tilni saqlaymiz
});

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "uz";
  switcher.value = savedLang;
  applyTranslations(savedLang);
});