Add-Type -AssemblyName System.Drawing

$ladyBmp = New-Object System.Drawing.Bitmap("d:\lisset\public\lady-clean.png")

# Target pink color for the lady silhouette
# Rich luxury rose pink: R=196, G=82, B=110 (#C4526E)
$pinkR = 196
$pinkG = 82
$pinkB = 110

$pinkBmp = New-Object System.Drawing.Bitmap($ladyBmp.Width, $ladyBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $ladyBmp.Height; $y++) {
    for ($x = 0; $x -lt $ladyBmp.Width; $x++) {
        $p = $ladyBmp.GetPixel($x, $y)
        if ($p.A -gt 0) {
            # Apply alpha with the new pink color
            $pinkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p.A, $pinkR, $pinkG, $pinkB))
        } else {
            $pinkBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$pinkBmp.Save("d:\lisset\public\lady-pink.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Lady pink silhouette generated at public/lady-pink.png!"

$ladyBmp.Dispose()
$pinkBmp.Dispose()
