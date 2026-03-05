const fs = require('fs');
const path = require('path');

const levelsDir = path.join(__dirname, 'levels');
const levelsDataPath = path.join(__dirname, 'data', 'levels.json');

// Создаём директории, если не существуют
if (!fs.existsSync(levelsDir)) fs.mkdirSync(levelsDir, { recursive: true });
if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));

// Генерация данных для Level 0–6
const levels = [];
for (let i = 0; i <= 6; i++) {
  levels.push({
    id: i,
    title: `Level ${i}`,
    description: `Пример задания для Level ${i}`,
  });
}

// Сохраняем levels.json
fs.writeFileSync(levelsDataPath, JSON.stringify(levels, null, 2), 'utf-8');
console.log('✅ data/levels.json создан');

// Генерация HTML страниц с мини-заданиями и кнопкой решения
for (let i = 1; i <= 6; i++) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Level ${i}</title>
<style>
  body { font-family: sans-serif; padding: 20px; }
  .solution { display: none; margin-top: 10px; background: #f0f0f0; padding: 10px; }
  button { margin-top: 10px; }
</style>
</head>
<body>
  <h1>Level ${i}</h1>
  <p>Mini-задание для Level ${i}</p>

  <!-- Кнопка показать решение -->
  <button onclick="document.getElementById('solution').style.display = 'block'">
    zeige Lösung / show solution / показать решение
  </button>

  <div id="solution" class="solution">
    <p>Решение для Level ${i}</p>
  </div>

  <script>
    // JS трёхъязычные комментарии
    // DE: Hier können weitere Logik oder interaktive Aufgaben eingefügt werden
    // EN: Additional logic or interactive exercises can be added here
    // RU: Здесь можно добавить дополнительную логику или интерактивные задания
  </script>
</body>
</html>
  `.trim();

  fs.writeFileSync(path.join(levelsDir, `level${i}.html`), htmlContent, 'utf-8');
  console.log(`✅ levels/level${i}.html создан`);
}

console.log('Все уровни созданы и готовы к тестированию!');
