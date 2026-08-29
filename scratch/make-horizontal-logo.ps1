Add-Type -AssemblyName System.Drawing

$lady = New-Object System.Drawing.Bitmap("d:\lisset\public\lady-transparent.png")

# Target dimensions for horizontal logo banner: 600 x 140
$bannerWidth = 600
$bannerHeight = 140
$banner = New-Object System.Drawing.Bitmap($bannerWidth, $bannerHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($banner)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Draw lady on left (height 120, width calculated by ratio)
$ladyAspect = $lady.Width / $lady.Height
$drawLadyHeight = 120
$drawLadyWidth = [int]($drawLadyHeight * $ladyAspect)
$drawLadyY = 10
$drawLadyX = 15

$g.DrawImage($lady, [System.Drawing.Rectangle]::new($drawLadyX, $drawLadyY, $drawLadyWidth, $drawLadyHeight))

# Prepare colors & fonts
$wineColor = [System.Drawing.Color]::FromArgb(255, 61, 10, 15)
$subColor = [System.Drawing.Color]::FromArgb(255, 100, 30, 45)
$brush = New-Object System.Drawing.SolidBrush($wineColor)
$subBrush = New-Object System.Drawing.SolidBrush($subColor)

# Font for KAYFIY
$fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
try {
    $fontFamily = New-Object System.Drawing.FontFamily("Arial Rounded MT Bold")
} catch {
    $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
}

$titleFont = New-Object System.Drawing.Font($fontFamily, 44, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$subFont = New-Object System.Drawing.Font([System.Drawing.FontFamily]::GenericSansSerif, 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

$textStartX = $drawLadyX + $drawLadyWidth + 24

# Draw KAYFIY with tracked spacing
$titleText = "K A Y F I Y"
$g.DrawString($titleText, $titleFont, $brush, $textStartX, 22)

# Draw COMFORT WEAR with heart
$subText = "C O M F O R T   W E A R"
$g.DrawString($subText, $subFont, $subBrush, $textStartX + 6, 80)

# Draw subtle heart / line
$pen = New-Object System.Drawing.Pen($subColor, 1)
$g.DrawLine($pen, $textStartX + 20, 108, $textStartX + 120, 108)
$g.DrawString("♥", $subFont, $brush, $textStartX + 130, 100)
$g.DrawLine($pen, $textStartX + 155, 108, $textStartX + 255, 108)

$g.Dispose()
$banner.Save("d:\lisset\public\kayfiy-horizontal-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Horizontal logo banner created at public/kayfiy-horizontal-logo.png!"

$lady.Dispose()
$banner.Dispose()
