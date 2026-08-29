Add-Type -AssemblyName System.Drawing

$transLogo = New-Object System.Drawing.Bitmap("d:\lisset\public\logo-transparent.png")

# Tight bounding box for KAYFIY letters:
# Let's inspect rows around y=620 to 715 and x=220 to 805
# Let's cleanly extract just the letters without any stray dots above
$textRect = [System.Drawing.Rectangle]::FromLTRB(215, 630, 810, 718)
$textBmp = New-Object System.Drawing.Bitmap($textRect.Width, $textRect.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($textBmp)
$g.DrawImage($transLogo, [System.Drawing.Rectangle]::new(0, 0, $textRect.Width, $textRect.Height), $textRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Remove any top-edge noise (first 4 rows)
for ($y = 0; $y -lt 5; $y++) {
    for ($x = 0; $x -lt $textBmp.Width; $x++) {
        $textBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    }
}

$textBmp.Save("d:\lisset\public\kayfiy-text-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Spotless KAYFIY text extracted! Size: $($textBmp.Width)x$($textBmp.Height)"

$transLogo.Dispose()
$textBmp.Dispose()
