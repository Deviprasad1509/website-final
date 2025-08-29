$files = Get-ChildItem -Path . -Filter *.tsx -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $content -replace "import \{ Header \} from '@/components/header'", "import Header from '@/components/header'"
    $updated = $updated -replace "import \{ Footer \} from '@/components/footer'", "import Footer from '@/components/footer'"
    Set-Content -Path $file.FullName -Value $updated
}
