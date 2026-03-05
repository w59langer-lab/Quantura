$root = (Get-Location).Path

function Add-Cand($list, $p) {
  if (Test-Path $p -PathType Container) {
    $full = (Resolve-Path $p).Path
    if (-not $list.Contains($full)) { $list.Add($full) }
  }
}

function HasAnyImg($dirs) {
  foreach ($d in $dirs) {
    if (Test-Path $d) {
      $f = Get-ChildItem $d -Recurse -File -Include *.png,*.jpg,*.jpeg,*.svg,*.webp -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($f) { return $true }
    }
  }
  return $false
}

$cands = New-Object 'System.Collections.Generic.List[string]'
Add-Cand $cands (Join-Path $root 'math_module')

Get-ChildItem (Join-Path $root 'backups_math_module') -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  Add-Cand $cands $_.FullName
  Add-Cand $cands (Join-Path $_.FullName 'math_module')
}
Get-ChildItem $root -Directory -Filter 'math_module__SAVE_*' -ErrorAction SilentlyContinue | ForEach-Object {
  Add-Cand $cands $_.FullName
  Add-Cand $cands (Join-Path $_.FullName 'math_module')
}
Get-ChildItem $root -Directory -Filter '_backup_*' -ErrorAction SilentlyContinue | ForEach-Object {
  Add-Cand $cands $_.FullName
  Add-Cand $cands (Join-Path $_.FullName 'math_module')
}
Get-ChildItem $root -Directory -Filter '_UNTRACKED_*' -ErrorAction SilentlyContinue | ForEach-Object {
  Add-Cand $cands $_.FullName
  Add-Cand $cands (Join-Path $_.FullName 'math_module')
}
Get-ChildItem $root -Directory -Filter '_QUARANTINE_untracked_*' -ErrorAction SilentlyContinue | ForEach-Object {
  Add-Cand $cands $_.FullName
  Add-Cand $cands (Join-Path $_.FullName 'math_module')
}

Write-Host "CANDIDATES: $($cands.Count)" -ForegroundColor Cyan

$rows = foreach ($d in $cands) {
  $scripts = Join-Path $d 'core\scripts.js'
  if (-not (Test-Path $scripts)) { $scripts = Join-Path $d 'scripts.js' }

  $txt = if (Test-Path $scripts) { Get-Content $scripts -Raw -ErrorAction SilentlyContinue } else { "" }

  $tasks = @(
    (Join-Path $d 'tasks.json'),
    (Join-Path $d 'assets\data\tasks.json'),
    (Join-Path $d 'data\tasks.json')
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1

  $hasLevel0 = (Test-Path (Join-Path $d 'levels\level0.html')) -or (Test-Path (Join-Path $d 'levels\level0.html.bak'))

  $hasAv = HasAnyImg @(
    (Join-Path $d 'assets\img\avatars'),
    (Join-Path $d 'assets\avatars'),
    (Join-Path $d 'pages\assets\img\avatars')
  )
  $hasTh = HasAnyImg @(
    (Join-Path $d 'assets\themes'),
    (Join-Path $d 'assets\img\themes'),
    (Join-Path $d 'pages\assets\img\themes')
  )

  $hitResults   = ($txt -match 'results-modal|result-table|Auswertung')
  $hitOpenModal = ($txt -match 'openModal\s*\(')
  $hitAvatar    = ($txt -match '\bavatar\b')
  $hitTeam      = ($txt -match '\bteam\b')
  $hitTheme     = ($txt -match 'theme|background|hintergrund')
  $hitSlides    = ($txt -match '\bslide\b|aufgaben|tasks\.json')
  $hitDataset   = ($txt -match 'dataset|data-')
  $hitWinOpen   = ($txt -match 'window\.open')

  $score = 0
  foreach ($b in @($hitResults,$hitOpenModal,$hitAvatar,$hitTeam,$hitTheme,$hitSlides,$hitDataset,[bool]$tasks,$hasLevel0,$hasAv,$hasTh)) { if ($b) { $score++ } }

  [pscustomobject]@{
    Score=$score; Dir=$d; ScriptsJS=[bool](Test-Path $scripts); TasksJson=[bool]$tasks; Level0=$hasLevel0;
    AvatarsImg=$hasAv; ThemesImg=$hasTh; ResultsModal=$hitResults; WindowOpen=$hitWinOpen
  }
}

$rows |
  Sort-Object -Property @{Expression='Score';Descending=$true}, @{Expression='AvatarsImg';Descending=$true}, @{Expression='ThemesImg';Descending=$true}, @{Expression='TasksJson';Descending=$true} |
  Select-Object -First 30 |
  Format-Table -AutoSize
