Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("d:\lisset\public\logo.png")
$c = $bmp.GetPixel(30, 30)
$textColor = $bmp.GetPixel(512, 650)
Write-Output "BG: R=$($c.R) G=$($c.G) B=$($c.B) Hex=#$($c.R.ToString('X2'))$($c.G.ToString('X2'))$($c.B.ToString('X2'))"
Write-Output "Text: R=$($textColor.R) G=$($textColor.G) B=$($textColor.B) Hex=#$($textColor.R.ToString('X2'))$($textColor.G.ToString('X2'))$($textColor.B.ToString('X2'))"
Write-Output "Size: $($bmp.Width) x $($bmp.Height)"
$bmp.Dispose()
