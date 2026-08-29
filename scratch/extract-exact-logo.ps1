Add-Type -AssemblyName System.Drawing

$transLogo = New-Object System.Drawing.Bitmap("d:\lisset\public\logo-transparent.png")

# 1. Lady bounding box (let's find tight bounding box)
# Lady is roughly y: 230 to 595, x: 300 to 730
$ladyRect = [System.Drawing.Rectangle]::FromLTRB(310, 230, 730, 595)
$ladyBmp = New-Object System.Drawing.Bitmap($ladyRect.Width, $ladyRect.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g1 = [System.Drawing.Graphics]::FromImage($ladyBmp)
$g1.DrawImage($transLogo, [System.Drawing.Rectangle]::new(0, 0, $ladyRect.Width, $ladyRect.Height), $ladyRect, [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
$ladyBmp.Save("d:\lisset\public\lady-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Extract EXACT "KAYFIY" text from the user's logo (y: 615 to 725, x: 220 to 805)
$textRect = [System.Drawing.Rectangle]::FromLTRB(210, 615, 815, 725)
$textBmp = New-Object System.Drawing.Bitmap($textRect.Width, $textRect.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g2 = [System.Drawing.Graphics]::FromImage($textBmp)
$g2.DrawImage($transLogo, [System.Drawing.Rectangle]::new(0, 0, $textRect.Width, $textRect.Height), $textRect, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$textBmp.Save("d:\lisset\public\kayfiy-text-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 3. Create a combined horizontal logo banner with lady + KAYFIY text side-by-side
# Sizing: Lady height 90px (slightly smaller & refined), Text height 55px (aligned with lady)
$targetHeight = 110
$ladyTargetH = 90
$ladyTargetW = [int]($ladyBmp.Width * ($ladyTargetH / $ladyBmp.Height))

$textTargetH = 48
$textTargetW = [int]($textBmp.Width * ($textTargetH / $textBmp.Height))

$gap = 28
$totalWidth = $ladyTargetW + $gap + $textTargetW + 20

$banner = New-Object System.Drawing.Bitmap($totalWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g3 = [System.Drawing.Graphics]::FromImage($banner)
$g3.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g3.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw Lady
$ladyY = [int](($targetHeight - $ladyTargetH) / 2)
$g3.DrawImage($ladyBmp, [System.Drawing.Rectangle]::new(10, $ladyY, $ladyTargetW, $ladyTargetH))

# Draw KAYFIY Text
$textY = [int](($targetHeight - $textTargetH) / 2)
$textX = 10 + $ladyTargetW + $gap
$g3.DrawImage($textBmp, [System.Drawing.Rectangle]::new($textX, $textY, $textTargetW, $textTargetH))

$g3.Dispose()
$banner.Save("d:\lisset\public\kayfiy-horizontal-clean.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Output "Lady size: $($ladyBmp.Width)x$($ladyBmp.Height)"
Write-Output "Text size: $($textBmp.Width)x$($textBmp.Height)"
Write-Output "Banner created: $($banner.Width)x$($banner.Height) at public/kayfiy-horizontal-clean.png"

$transLogo.Dispose()
$ladyBmp.Dispose()
$textBmp.Dispose()
$banner.Dispose()
