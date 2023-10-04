<?php
$redirects = [];
try {
  $data = json_decode(file_get_contents(__DIR__ . '/initialData.json'), true);
  $redirects = $data['redirects']['data'];
} catch (\Exception $e) {
}

function isSecure() {
  return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || $_SERVER['SERVER_PORT'] == 443;
}
if (isSecure()) {
  $redirect = '';
  $redirectbase = 'https://' . $_SERVER['HTTP_HOST'];

  $redirect_to = '';
  $request_page = trim($_SERVER['REQUEST_URI'], '/');

  foreach ($redirects as $r) {
    if (strpos($r['from'], '*') !== false) {
      $from = substr($r['from'], 0, -1);
      if (strncmp($request_page, $from, strlen($from)) === 0) {
        if (strpos($r['to'], '*') !== false) {
          $r['to'] = substr($r['to'], 0, -1);
        }
        $urlsuffix = substr($request_page, strlen($from));
        $redirect_to = $r['to'] . $urlsuffix;
      }
    }
    if ($r['from'] == $request_page) {
      $redirect_to = $r['to'];
    }
  }

  if ($redirect_to) {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: ' . $redirectbase . '/' . $redirect_to);
    exit();
  } else {
    echo file_get_contents('index.html');
  }
} else {
  $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
  header('HTTP/1.1 301 Moved Permanently');
  header('Location: ' . $redirect);
  exit();
}
