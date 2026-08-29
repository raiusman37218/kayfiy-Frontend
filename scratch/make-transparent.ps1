Add-Type -AssemblyName System.Drawing

$srcBmp = New-Object System.Drawing.Bitmap("d:\lisset\public\logo.png")

# Background color in logo: #FCD7DE (R=252, G=215, B=222)
$bgR = 252.0
$bgG = 215.0
$bgB = 222.0

# 1. First, let's create a transparent version of the entire logo
$transBmp = New-Object System.Drawing.Bitmap($srcBmp.Width, $srcBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $srcBmp.Height; $y++) {
    for ($x = 0; $x -lt $srcBmp.Width; $x++) {
        $p = $srcBmp.GetPixel($x, $y)
        
        # Calculate color difference from background
        $dist = [Math]::Sqrt([Math]::Pow($p.R - $bgR, 2) + [Math]::Pow($p.G - $bgG, 2) + [Math]::Pow($p.B - $bgB, 2))
        
        if ($dist -lt 8) {
            # Completely background
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($dist -gt 45) {
            # Fully opaque line
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 61, 10, 15))
        } else {
            # Smooth anti-aliased edge
            $alpha = [int](($dist - 8) / (45 - 8) * 255)
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 61, 10, 15))
        }
    }
}

$transBmp.Save("d:\lisset\public\logo-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Extract Lady Figure only (approx x: 280 to 740, y: 220 to 600)
$ladyRect = [System.Drawing.Rectangle]::FromLTRB(280, 210, 745, 600)
$ladyBmp = New-Object System.Drawing.Bitmap($ladyRect.Width, $ladyRect.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($ladyBmp)
$g.DrawImage($transBmp, [System.Drawing.Rectangle]::FromLTRB(0, 0, $ladyRect.Width, $ladyRect.Height), $ladyRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$ladyBmp.Save("d:\lisset\public\lady-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Output "Transparent logo & Lady extracted successfully!"
$srcBmp.Dispose()
$transBmp.Dispose()
$ladyBmp.Dispose()
