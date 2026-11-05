# Сайт игры «Битва ниндзя» для GitHub Pages

Адрес сайта: **https://nurislam-abdimalikov.github.io**

Сайт уже опубликован. После каждого изменения в ветке `main` GitHub сам обновляет его через 1–3 минуты.

## Что где лежит

| Файл / папка | Зачем |
|---|---|
| `index.html` | главная страница игры (русский / английский, переключатель вверху). Русские тексты — прямо в разметке, английские — в блоке `<script type="application/json" id="nb-data">` |
| `privacy-policy-ru.html`, `privacy-policy-en.html` | политика конфиденциальности — ссылку на неё вставляешь в Google Play и App Store |
| `#support` (раздел на главной) | страница поддержки для App Store (Support URL): https://nurislam-abdimalikov.github.io/#support |
| `app-ads.txt` | файл для AdMob (подтверждает, что реклама в игре — твоя) |
| `assets/site.css` | оформление всех страниц |
| `assets/site.js` | главная страница: язык, герои, скриншоты, вопросы |
| `assets/fx.js` | общее для всех страниц: меню, искры на фоне, плавное появление блоков |
| `assets/img/` | логотипы игры (`logo-ru.png`, `logo-en.png`) |
| `assets/heroes/`, `assets/bosses/`, `assets/worlds/` | герои, боссы и фоны миров из игры (`world0.jpg` … `world4.jpg`) |
| `assets/icons/` | значки из игры |
| `assets/shots/ru/`, `assets/shots/en/` | скриншоты: в самой папке — маленькие, в `md/` — средние, в `full/` — большие (открываются при нажатии) |
| `assets/fonts/` | шрифты Russo One и Rubik (бесплатная лицензия OFL — файлы лицензий рядом) |
| `favicon.png`, `assets/apple-touch-icon.png`, `assets/icon-*.png` | значок сайта во вкладке и на телефоне |
| `assets/feature-ru.jpg`, `assets/feature-en.jpg` | картинка-превью, когда ссылку на сайт отправляют в мессенджере |

## Что поменять потом

- **`app-ads.txt`** — когда создашь аккаунт AdMob, замени `pub-XXXXXXXXXXXXXXXX` на свой идентификатор издателя (AdMob → Настройки → Информация об аккаунте). Файл должен лежать именно в корне сайта — так и есть. AdMob проверяет его до 24 часов. В Google Play и App Store в поле «Сайт разработчика» должен стоять адрес `https://nurislam-abdimalikov.github.io`.
- **Кнопки магазинов** — когда игра выйдет, открой `index.html`, найди в конце строки `GOOGLE_PLAY_URL = ''` и `APP_STORE_URL = ''` и вставь ссылки между кавычками. Надпись «Скоро» исчезнет, и кнопки сами станут кнопками «Скачать».
- **Как изменить файл прямо на GitHub:** открой файл → значок карандаша (Edit) → правка → **Commit changes**.
