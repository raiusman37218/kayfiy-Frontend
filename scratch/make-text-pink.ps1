Add-Type -AssemblyName System.Drawing

$textBmp = New-Object System.Drawing.Bitmap("d:\lisset\public\kayfiy-text-clean.png")

# Same pink color as the lady: R=196, G=82, B=110 (#C4526E)
$pinkR = 196
$pinkG = 82
$pinkB = 110

$pinkTextBmp = New-Object System.Drawing.Bitmap($textBmp.Width, $textBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $textBmp.Height; $y++) {
    for ($x = 0; $x -lt $textBmp.Width; $x++) {
        $p = $textBmp.GetPixel($x, $y)
        if ($p.A -gt 0) {
            $pinkTextBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p.A, $pinkR, $pinkG, $pinkB))
        } else {
            $pinkTextBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$pinkTextBmp.Save("d:\lisset\public\kayfiy-text-pink.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Pink KAYFIY text generated at public/kayfiy-text-pink.png!"

$textBmp.Dispose()
$pinkTextBmp.Dispose()
