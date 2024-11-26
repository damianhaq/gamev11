# DGame Engine v3.3

DGame to lekki i wydajny silnik do tworzenia gier 2D w JavaScript. Zapewnia bogaty zestaw narzędzi i funkcji do tworzenia interaktywnych gier w przeglądarce.

## Główne Funkcjonalności

### 🎮 Podstawowe Komponenty

- **Game** - główna klasa zarządzająca grą
- **Sprite** - system zarządzania obiektami gry
- **Character** - rozszerzona klasa do tworzenia postaci
- **GUI** - system interfejsu użytkownika
- **Tiled** - obsługa map kafelkowych
- **Vector** - zaawansowana obsługa wektorów

### 🎯 Funkcje Zarządzania

- System grup obiektów
- Zarządzanie kamerą
- Obsługa kolizji (AABB, linia-prostokąt, linia-linia)
- System animacji
- Obsługa wejścia (klawiatura, mysz)

### 🎨 Renderowanie

- Zaawansowane transformacje obrazów
- Obsługa sprite'ów i tekstur
- Rysowanie kształtów podstawowych
- Rysowanie tekstu
- Debug mode z wizualizacją kolizji

### 🎪 Systemy Gry

- System pocisków (Projectile)
- Zarządzanie kolizjami
- System statystyk postaci
- Obsługa map kafelkowych
- Wsparcie dla różnych typów kontroli (WSAD, LMB, RMB)

## Przykłady Użycia

### Inicjalizacja Gry

```javascript
const game = new Game();
game.init("canvasId", 800, 600, 1); // ID, szerokość, wysokość, skala
```

### Tworzenie i Zarządzanie Sprite'ami

```javascript
// Podstawowy sprite
const sprite = new Sprite(100, 100, 32, 32, game);

// Dodawanie tekstury
sprite.addTexture(0, 0, 32, 32, imageObject);

// Dodawanie animacji
sprite.addAnim("walk", 0, 0, 32, 32, 8, spriteSheet); // nazwa, x, y, szerokość, wysokość, liczba klatek, obrazek
sprite.setCurrentAnim("walk");

// Obracanie i odbijanie sprite'a
sprite.isFlipX = true; // odbicie poziome
sprite.isFlipY = false; // bez odbicia pionowego
```

### System Postaci

```javascript
// Tworzenie postaci gracza
const player = new Character(x, y, width, height, game);

// Różne typy sterowania
player.enableWSADMove(); // sterowanie WSAD
player.enableMOUSEMove("LMB"); // sterowanie myszką (LMB/RMB)
```

### Zarządzanie Grupami i Kolizjami

```javascript
// Tworzenie grup obiektów
game.createGroup("enemies");
game.createGroup("projectiles");

// Dodawanie obiektów do grup
game.addToGroup("enemies", enemySprite);
game.addToGroup("projectiles", bulletSprite);

// Sprawdzanie kolizji
const isColliding = sprite.checkCollisionAABBNew(
  sprite.x,
  sprite.y,
  sprite.width,
  sprite.height,
  otherSprite.x,
  otherSprite.y,
  otherSprite.width,
  otherSprite.height
);
```

### System Pocisków

```javascript
// Tworzenie pocisku
const bullet = new Projectile(x, y, width, height, game, velocityX, velocityY);

// Ustawianie zachowania pocisku
bullet.killAfterDistance(500); // zniszcz po przebyciu 500 jednostek
bullet.acc = new Vector(0, 0.1); // dodaj grawitację
```

### Manipulacja Kamerą

```javascript
// Aktualizacja pozycji kamery
game.updateCamera(playerX, playerY); // kamera śledzi gracza

// Włączenie przesuwania kamery prawym przyciskiem myszy
game.moveCameraRMB();
```

### GUI i Rysowanie

```javascript
// Tworzenie okna GUI
const gui = new GUI(game);

gui.addImage(guiImage);

gui.addTile(352, 912, 16, 16, "mainWindow", "leftTop");
gui.addTile(368, 912, 16, 16, "mainWindow", "top");
gui.addTile(384, 912, 16, 16, "mainWindow", "rightTop");
// dodanie kafelka do GUI i przypisanie mu pozycji i id

gui.createWindow(5, 3, tileId, x, y); // szerokość, wysokość, id kafelka, pozycja x, y

// Rysowanie kształtów i tekstu
game.drawRectOnMap(x, y, width, height, ctx, camera, "red", 2); // prostokąt
game.drawCircleOnMap(x, y, radius, ctx, camera, "blue", 1); // okrąg
game.drawLineOnMap(x1, y1, x2, y2, ctx, camera, "green", 1); // linia
game.drawTextOnMap("Hello World!", x, y, game); // tekst
```

### Operacje na Wektorach

```javascript
// Tworzenie i manipulacja wektorami
const vector = new Vector(5, 3);
vector.normalize(); // normalizacja wektora
vector.setMag(10); // ustawienie długości wektora
vector.limit(5); // ograniczenie długości wektora

// Obliczanie odległości
const distance = vector.getDistance(otherVector);

// Rotacja wektora
vector.rotate(45); // obrót o 45 stopni
```

### Obsługa Map Kafelkowych

```javascript
// Inicjalizacja mapy
const tiled = new Tiled(game, "path/to/map.json", tilesetImage);

// Rysowanie warstw
tiled.drawLayer("background", playerX, playerY);
tiled.drawLayer("collision", playerX, playerY);

// Rysowanie granic świata
tiled.drawWorldBorders();
```

## Zaawansowane Funkcje

### System Kolizji

- Kolizje AABB
- Wykrywanie kolizji linia-prostokąt

### Zarządzanie Kamerą

- Śledzenie obiektów
- Przesuwanie kamery za pomocą prawego przycisku myszy

### Animacje

- Obsługa sprite sheets
- Animacje jednorazowe

### Fizyka

- System wektorów
- Przyspieszenie i prędkość
- Ograniczanie prędkości
- Normalizacja wektorów

## Wymagania Systemowe

- Nowoczesna przeglądarka internetowa z obsługą HTML5
- Obsługa JavaScript ES6+

## Wersjonowanie

Aktualna wersja: 3.3

- Dodano nową klasę GUI
- Ulepszenia w systemie renderowania
- Optymalizacje wydajności

## Licencja

Ten projekt jest dostępny na licencji MIT.
