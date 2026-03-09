<?php
// Simple session-based login demo that reads users from .htpasswd
// Adds a logout button and auto-logout after a period of inactivity.

session_start();

$timeoutSeconds = 120; // Probe: 2 Minuten aktiv, später z.B. 1800 (30 min) setzen
$htpasswdPath   = __DIR__ . '/.htpasswd';

// Load users (username => hash) from .htpasswd if available
$users = [];
if (is_readable($htpasswdPath)) {
    foreach (file($htpasswdPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos($line, ':') === false) {
            continue;
        }
        [$user, $hash] = explode(':', $line, 2);
        $users[$user] = $hash;
    }
}

// Destroy session and clear cookie
function doLogout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}

// Handle logout request (POST or GET)
if (isset($_POST['logout']) || isset($_GET['logout'])) {
    doLogout();
    $redirect = $_POST['redirect'] ?? $_GET['redirect'] ?? null;
    // allow only relative redirects to avoid open redirects
    if ($redirect && str_starts_with($redirect, '/')) {
        header('Location: ' . $redirect);
    } else {
        header('Location: ' . $_SERVER['PHP_SELF'] . '?logged_out=1');
    }
    exit;
}

// Enforce inactivity timeout for logged-in users
if (isset($_SESSION['username'])) {
    $lastActivity = $_SESSION['last_activity'] ?? 0;
    if (time() - $lastActivity > $timeoutSeconds) {
        doLogout();
        header('Location: ' . $_SERVER['PHP_SELF'] . '?expired=1');
        exit;
    }
    $_SESSION['last_activity'] = time();
}

// If the server already authenticated via Basic Auth, adopt that identity
if (!isset($_SESSION['username']) && isset($_SERVER['REMOTE_USER']) && $_SERVER['REMOTE_USER'] !== '') {
    $_SESSION['username'] = $_SERVER['REMOTE_USER'];
    $_SESSION['last_activity'] = time();
}

// Attempt login via the form
$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'], $_POST['password']) && !isset($_SESSION['username'])) {
    $username = trim($_POST['username']);
    $password = (string) $_POST['password'];

    if (!isset($users[$username])) {
        $error = 'Unbekannter Benutzer.';
    } else {
        $hash = $users[$username];
        // Apache apr1 hashes can be verified with crypt
        if (hash_equals($hash, crypt($password, $hash))) {
            session_regenerate_id(true);
            $_SESSION['username'] = $username;
            $_SESSION['last_activity'] = time();
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        } else {
            $error = 'Passwort stimmt nicht.';
        }
    }
}

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Login / Abmelden</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; background: #f7f7f9; color: #111; }
    .card { max-width: 420px; background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    h1 { margin-top: 0; font-size: 1.4rem; }
    label { display: block; margin: 0.6rem 0 0.2rem; }
    input[type="text"], input[type="password"] { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { margin-top: 1rem; padding: 0.6rem 1rem; border: none; border-radius: 4px; background: #005bbb; color: #fff; cursor: pointer; }
    button:hover { background: #004799; }
    .hint { color: #555; font-size: 0.9rem; margin-top: 0.6rem; }
    .error { color: #c0392b; margin-bottom: 0.6rem; }
    .success { color: #2c7a34; margin-bottom: 0.6rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Server-Zugang</h1>

    <?php if (isset($_GET['expired'])): ?>
      <div class="error">Automatisch abgemeldet (Inaktivität).</div>
    <?php elseif (isset($_GET['logged_out'])): ?>
      <div class="success">Erfolgreich abgemeldet.</div>
    <?php endif; ?>

    <?php if ($error): ?>
      <div class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <?php if (!isset($_SESSION['username'])): ?>
      <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
        <label for="username">Benutzername</label>
        <input id="username" name="username" type="text" autocomplete="username" required>

        <label for="password">Passwort</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>

        <button type="submit">Anmelden</button>
        <p class="hint">Test-Timeout: <?php echo $timeoutSeconds / 60; ?> Minute(n). Für den Live-Betrieb bitte auf 30 Minuten (=1800 Sekunden) setzen.</p>
      </form>
    <?php else: ?>
      <p>Angemeldet als <strong><?php echo htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8'); ?></strong>.</p>
      <p class="hint">Automatisches Abmelden nach <?php echo $timeoutSeconds / 60; ?> Minute(n) Inaktivität.</p>
      <div id="timeout-warning" class="warning" style="display:none;margin-bottom:10px;padding:10px;border:1px solid #f0b37e;background:#fff7e6;color:#8a4b08;border-radius:6px;">
        Seite wird in <span id="warning-minutes">1</span> Minute gesperrt. Bitte speichern oder abmelden.
      </div>
      <form id="logout-form" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
        <input type="hidden" name="logout" value="1">
        <input type="hidden" name="redirect" value="/prog_min/">
        <button type="submit">Abmelden</button>
      </form>
      <script>
        // Client-seitiger Schutz: meldet ab, wenn die Zeit überschritten wird
        const timeoutMs = <?php echo (int) ($timeoutSeconds * 1000); ?>;
        const warningOffsetMs = 60 * 1000; // 1 Minute vor Ablauf warnen
        let timer;
        let warningTimer;
        const warningBox = document.getElementById('timeout-warning');
        const resetTimer = () => {
          clearTimeout(timer);
          clearTimeout(warningTimer);
          if (warningBox) warningBox.style.display = 'none';
          timer = setTimeout(() => {
            document.getElementById('logout-form').submit();
          }, timeoutMs);
          // Nur warnen, wenn genug Zeit
          if (timeoutMs > warningOffsetMs) {
            warningTimer = setTimeout(() => {
              if (warningBox) warningBox.style.display = 'block';
            }, timeoutMs - warningOffsetMs);
          }
        };
        ['click', 'keydown', 'mousemove', 'touchstart'].forEach(evt => {
          window.addEventListener(evt, resetTimer);
        });
        resetTimer();
      </script>
    <?php endif; ?>
  </div>
</body>
</html>
