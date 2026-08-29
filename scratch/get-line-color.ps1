Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("d:\lisset\public\logo.png")
$minLum = 1.0
$darkestHex = ""
for ($y = 200; $y -lt 800; $y += 5) {
    for ($x = 200; $x -lt 800; $x += 5) {
        $pixel = $bmp.GetPixel($x, $y)
        $lum = (0.299 * $pixel.R + 0.587 * $pixel.G + 0.114 * $pixel.B) / 255.0
        if ($lum -lt $minLum) {
            $minLum = $lum
            $darkestHex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B
        }
    }
}
Write-Output "Darkest Color (Line Art): $darkestHex (Lum: $minLum)"
$bmp.Dispose()
