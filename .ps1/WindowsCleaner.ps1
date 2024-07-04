$drives = Get-PSDrive -PSProvider FileSystem

foreach ($drive in $drives) {
  $driveRoot = $drive.Root

  Get-ChildItem -Path $driveRoot -Include ('*.tmp','*._mp','*.log','*.gid','*.chk','*.old') -Recurse -File | ForEach-Object { Remove-Item -Path $_.FullName -Force }

  $FoldersList = Get-ChildItem -Path $driveRoot -Directory -Recurse
  foreach ($Folder in $FoldersList) {
    if (-not (Get-ChildItem -Force $Folder.FullName)) {
      Remove-Item -Path $Folder.FullName  -Force
    }
  } 
}