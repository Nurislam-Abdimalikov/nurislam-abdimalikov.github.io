# Сайт игры «Битва ниндзя» для GitHub Pages

Адрес сайта: **https://nurislam-abdimalikov.github.io**

| Файл | Зачем |
|---|---|
| `index.html` | главная страница игры (русский / английский, переключатель вверху) |
| `privacy-policy-ru.html`, `privacy-policy-en.html` | политика конфиденциальности — ссылку на неё вставляешь в Google Play и App Store |
| `app-ads.txt` | файл для AdMob (подтверждает, что реклама в игре — твоя) |
| `#support` (раздел на главной) | страница поддержки для App Store (Support URL) |
| `assets/` | значок, скриншоты, шрифт |

## Как выложить (5 минут, один раз)

1. Войди на [github.com](https://github.com) под ником **Nurislam-Abdimalikov**.
2. Справа вверху «**+**» → **New repository**.
3. Repository name — ровно: **`Nurislam-Abdimalikov.github.io`**. Выбери **Public**. Нажми **Create repository**.
4. На странице репозитория нажми ссылку **uploading an existing file** (или **Add file → Upload files**).
5. Перетащи **всё содержимое** этой папки (файлы `index.html`, `privacy-policy-*.html`, `app-ads.txt`, `favicon.png`, `.nojekyll` и папку `assets`) — не саму папку, а то, что внутри. Нажми **Commit changes**.
6. **Settings → Pages**: Source — **Deploy from a branch**, Branch — **main**, папка **/ (root)** → **Save**.
7. Через 1–3 минуты сайт откроется по адресу https://nurislam-abdimalikov.github.io. Проверь ещё:
   - https://nurislam-abdimalikov.github.io/privacy-policy-en.html
   - https://nurislam-abdimalikov.github.io/app-ads.txt

> Если файл `.nojekyll` не виден в проводнике (он «скрытый») — ничего страшного, сайт работает и без него.

## Что поменять потом

- **`app-ads.txt`** — когда создашь аккаунт AdMob, замени `pub-XXXXXXXXXXXXXXXX` на свой идентификатор издателя (AdMob → Настройки → Информация об аккаунте). Файл должен лежать именно в корне сайта — так и есть. AdMob проверяет его до 24 часов. В Google Play и App Store в поле «Сайт разработчика» должен стоять адрес `https://nurislam-abdimalikov.github.io`.
- **Кнопки магазинов** — когда игра выйдет, открой `index.html`, найди в конце строки `GOOGLE_PLAY_URL = ''` и `APP_STORE_URL = ''` и вставь ссылки между кавычками. Значки «Скоро в…» сами станут кнопками «Скачать».
- Чтобы изменить файл прямо на GitHub: открой его → значок карандаша ✏️ → правка → **Commit changes**.
