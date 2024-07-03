$drives = Get-PSDrive -PSProvider FileSystem

foreach ($drive in $drives) {
  $driveRoot = $drive.Root

  Get-ChildItem -Path $driveRoot *.tmp -Recurse | ForEach-Object { Remove-Item -Path $_.FullName }
  Get-ChildItem -Path $driveRoot *._mp -Recurse | ForEach-Object { Remove-Item -Path $_.FullName }
  Get-ChildItem -Path $driveRoot *.log -Recurse | ForEach-Object { Remove-Item -Path $_.FullName }
  Get-ChildItem -Path $driveRoot *.gid -Recurse | ForEach-Object { Remove-Item -Path $_.FullName }
  Get-ChildItem -Path $driveRoot *.chk -Recurse | ForEach-Object { Remove-Item -Path $_.FullName }
  Get-ChildItem -Path $driveRoot *.old -Recurse | ForEach-Object { Remove-Item -Path $_.FullName }

  $FoldersList = Get-ChildItem -Path $driveRoot -Directory -Recurse
  foreach ($Folder in $FoldersList) {
    if (-not (gci -Force $Folder.FullName)) {
      Remove-Item -Path $Folder.FullName  -Force
    }
  } 
}