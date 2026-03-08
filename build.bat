@echo off
rd /s /q dist 2>nul
del hxxps.zip 2>nul
powershell -command "New-Item -ItemType Directory -Path dist | Out-Null; $exclude = @('dist','build.bat','hxxps.zip','README.md','LICENSE','.git','.gitignore','privacy.html','hxxpsgeminiplain.jpg'); Get-ChildItem -Path '.' | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object { Copy-Item $_.FullName -Destination 'dist' -Recurse -Force }"
powershell -command "Compress-Archive -Path dist\* -DestinationPath hxxps.zip"
echo Done. hxxps.zip is ready to upload.
