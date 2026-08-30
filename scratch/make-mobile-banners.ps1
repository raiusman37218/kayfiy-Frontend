Add-Type -AssemblyName System.Drawing

function Create-MobileBanner {
    param (
        [string]$SourcePath,
        [string]$DestPath,
        [int]$TargetWidth = 800,
        [int]$TargetHeight = 600,
        [float]$CropCenterY = 0.5, # 0.0 = top, 0.5 = middle, 1.0 = bottom
        [float]$CropCenterX = 0.5
    )

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    
    # Target aspect ratio is TargetWidth / TargetHeight (e.g., 800/600 = 1.333)
    $targetAspect = $TargetWidth / $TargetHeight
    $srcAspect = $src.Width / $src.Height

    if ($srcAspect -gt $targetAspect) {
        # Source is wider than target: crop width
        $cropH = $src.Height
        $cropW = [int]($src.Height * $targetAspect)
        $cropX = [int](($src.Width - $cropW) * $CropCenterX)
        $cropY = 0
    } else {
        # Source is taller than target: crop height
        $cropW = $src.Width
        $cropH = [int]($src.Width / $targetAspect)
        $cropX = 0
        $cropY = [int](($src.Height - $cropH) * $CropCenterY)
    }

    $bmp = New-Object System.Drawing.Bitmap($TargetWidth, $TargetHeight)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $TargetWidth, $TargetHeight)
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)

    $gfx.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    # Save as high-quality JPEG
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)

    $bmp.Save($DestPath, $encoder, $encoderParams)

    $gfx.Dispose()
    $bmp.Dispose()
    $src.Dispose()
    Write-Host "Created $DestPath ($TargetWidth x $TargetHeight) from $SourcePath"
}

# 1. Best Sellers: assorted bras and panties
Create-MobileBanner -SourcePath "d:\lisset\public\images\bras-assorted.jpg" -DestPath "d:\lisset\public\banners\sec-best-sellers-mobile.jpg" -TargetWidth 800 -TargetHeight 600 -CropCenterY 0.55

# 2. Bras: black lace bra with flowers & earrings
Create-MobileBanner -SourcePath "d:\lisset\public\images\bra-lace-black.jpg" -DestPath "d:\lisset\public\banners\sec-bras-mobile.jpg" -TargetWidth 800 -TargetHeight 600 -CropCenterY 0.45

# 3. Bra Sets: maroon lace bralette with blue satin & peacock feather
Create-MobileBanner -SourcePath "d:\lisset\public\images\bralette-maroon.jpg" -DestPath "d:\lisset\public\banners\sec-bra-sets-mobile.jpg" -TargetWidth 800 -TargetHeight 600 -CropCenterY 0.70

# 4. Shapewear: camisoles stack
Create-MobileBanner -SourcePath "d:\lisset\public\images\camisoles-stack.jpg" -DestPath "d:\lisset\public\banners\sec-shapewear-mobile.jpg" -TargetWidth 800 -TargetHeight 600 -CropCenterY 0.45

# 5. Panties: cream lace brief
Create-MobileBanner -SourcePath "d:\lisset\public\images\brief-cream-lace.jpg" -DestPath "d:\lisset\public\banners\sec-panties-mobile.jpg" -TargetWidth 800 -TargetHeight 600 -CropCenterY 0.50
