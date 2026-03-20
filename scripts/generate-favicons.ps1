param(
  [string]$Source,
  [string]$OutDir = "public"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Add-Type -AssemblyName System.Drawing

function New-BaseIcon {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Size
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::White)

    # Palette approximating the brand colors.
    $blue = [System.Drawing.ColorTranslator]::FromHtml("#1e5ea9")
    $blueDark = [System.Drawing.ColorTranslator]::FromHtml("#0f3e7a")
    $gold = [System.Drawing.ColorTranslator]::FromHtml("#d4a83a")
    $goldDark = [System.Drawing.ColorTranslator]::FromHtml("#9a6e12")
    $orange = [System.Drawing.ColorTranslator]::FromHtml("#f05a28")
    $green = [System.Drawing.ColorTranslator]::FromHtml("#38a169")

    $bBlue = New-Object System.Drawing.SolidBrush $blue
    $bBlueDark = New-Object System.Drawing.SolidBrush $blueDark
    $bGold = New-Object System.Drawing.SolidBrush $gold
    $bOrange = New-Object System.Drawing.SolidBrush $orange
    $bGreen = New-Object System.Drawing.SolidBrush $green
    $bWhite = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $pBlue = New-Object System.Drawing.Pen $blueDark, ([Math]::Max(2, [int]($Size * 0.012)))
    $pGold = New-Object System.Drawing.Pen $goldDark, ([Math]::Max(2, [int]($Size * 0.012)))

    try {
      # House (left)
      $houseX = [int]($Size * 0.15)
      $houseY = [int]($Size * 0.30)
      $houseW = [int]($Size * 0.34)
      $houseH = [int]($Size * 0.30)
      $roofPeakX = $houseX + [int]($houseW * 0.5)
      $roofPeakY = $houseY - [int]($Size * 0.12)

      $roof = New-Object System.Drawing.Drawing2D.GraphicsPath
      $roof.AddPolygon(@(
        (New-Object System.Drawing.Point $houseX, $houseY),
        (New-Object System.Drawing.Point $roofPeakX, $roofPeakY),
        (New-Object System.Drawing.Point ($houseX + $houseW), $houseY)
      ))
      $g.FillPath($bBlue, $roof)
      $g.DrawPath($pBlue, $roof)
      $roof.Dispose()

      $bodyRect = New-Object System.Drawing.Rectangle $houseX, $houseY, $houseW, $houseH
      $g.FillRectangle($bWhite, $bodyRect)
      $g.DrawRectangle($pBlue, $bodyRect)

      # Window
      $winSize = [int]($houseW * 0.22)
      $winX = $houseX + [int]($houseW * 0.55)
      $winY = $houseY + [int]($houseH * 0.35)
      $winRect = New-Object System.Drawing.Rectangle $winX, $winY, $winSize, $winSize
      $g.FillRectangle($bBlueDark, $winRect)

      # Concierge bell (center bottom)
      $bellCx = [int]($Size * 0.45)
      $bellCy = [int]($Size * 0.60)
      $bellR = [int]($Size * 0.13)
      $bellRect = New-Object System.Drawing.Rectangle ($bellCx - $bellR), ($bellCy - $bellR), (2 * $bellR), (2 * $bellR)
      $g.FillEllipse($bGold, $bellRect)
      $g.DrawEllipse($pGold, $bellRect)

      $baseH = [int]($Size * 0.06)
      $baseRect = New-Object System.Drawing.Rectangle ($bellCx - $bellR), ($bellCy + $bellR - [int]($baseH * 0.6)), (2 * $bellR), $baseH
      $g.FillEllipse($bBlueDark, $baseRect)

      # Location pin (right)
      $pinCx = [int]($Size * 0.70)
      $pinCy = [int]($Size * 0.46)
      $pinR = [int]($Size * 0.12)
      $pinCircle = New-Object System.Drawing.Rectangle ($pinCx - $pinR), ($pinCy - $pinR), (2 * $pinR), (2 * $pinR)
      $g.FillEllipse($bOrange, $pinCircle)

      $pinTip = New-Object System.Drawing.Drawing2D.GraphicsPath
      $pinTip.AddPolygon(@(
        (New-Object System.Drawing.Point ($pinCx - [int]($pinR * 0.55)), ($pinCy + [int]($pinR * 0.55))),
        (New-Object System.Drawing.Point ($pinCx + [int]($pinR * 0.55)), ($pinCy + [int]($pinR * 0.55))),
        (New-Object System.Drawing.Point $pinCx, ($pinCy + [int]($pinR * 1.65)))
      ))
      $g.FillPath($bOrange, $pinTip)
      $pinTip.Dispose()

      $innerR = [int]($pinR * 0.45)
      $innerCircle = New-Object System.Drawing.Rectangle ($pinCx - $innerR), ($pinCy - $innerR), (2 * $innerR), (2 * $innerR)
      $g.FillEllipse($bWhite, $innerCircle)

      # Palm hint (small, top right)
      $leafPen = New-Object System.Drawing.Pen $green, ([Math]::Max(2, [int]($Size * 0.010)))
      $leafPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
      $leafPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
      $px = [int]($Size * 0.86)
      $py = [int]($Size * 0.27)
      $g.DrawArc($leafPen, ($px - 30), ($py - 30), 60, 60, 210, 70)
      $g.DrawArc($leafPen, ($px - 30), ($py - 30), 60, 60, 260, 70)
      $g.DrawArc($leafPen, ($px - 30), ($py - 30), 60, 60, 310, 70)
      $leafPen.Dispose()
    }
    finally {
      $bBlue.Dispose()
      $bBlueDark.Dispose()
      $bGold.Dispose()
      $bOrange.Dispose()
      $bGreen.Dispose()
      $bWhite.Dispose()
      $pBlue.Dispose()
      $pGold.Dispose()
    }

    return $bmp
  }
  finally {
    $g.Dispose()
  }
}

function Save-Png {
  param(
    [Parameter(Mandatory = $true)]
    [System.Drawing.Bitmap]$BaseSquare,
    [Parameter(Mandatory = $true)]
    [int]$Size,
    [Parameter(Mandatory = $true)]
    [string]$OutPath
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $gr = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gr.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gr.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gr.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $gr.Clear([System.Drawing.Color]::Transparent)
    $gr.DrawImage($BaseSquare, 0, 0, $Size, $Size)
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $gr.Dispose()
    $bmp.Dispose()
  }
}

$base512 = $null
try {
  if ($Source -and (Test-Path -LiteralPath $Source)) {
    $img = [System.Drawing.Image]::FromFile($Source)
    try {
      $side = [Math]::Min($img.Width, $img.Height)
      $x = [int](($img.Width - $side) / 2)
      $y = [int](($img.Height - $side) / 2)

      $base512 = New-Object System.Drawing.Bitmap 512, 512
      $g = [System.Drawing.Graphics]::FromImage($base512)
      try {
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.Clear([System.Drawing.Color]::White)
        $g.DrawImage(
          $img,
          (New-Object System.Drawing.Rectangle 0, 0, 512, 512),
          (New-Object System.Drawing.Rectangle $x, $y, $side, $side),
          [System.Drawing.GraphicsUnit]::Pixel
        )
      }
      finally { $g.Dispose() }
    }
    finally { $img.Dispose() }
  }
  else {
    # Fallback: generate a clean brand-like icon procedurally.
    $base512 = New-BaseIcon -Size 512
  }

  # Save a logo for structured data usage.
  $base512.Save((Join-Path $OutDir "logo.png"), [System.Drawing.Imaging.ImageFormat]::Png)

  Save-Png -BaseSquare $base512 -Size 16 -OutPath (Join-Path $OutDir "favicon-16x16.png")
  Save-Png -BaseSquare $base512 -Size 32 -OutPath (Join-Path $OutDir "favicon-32x32.png")
  Save-Png -BaseSquare $base512 -Size 180 -OutPath (Join-Path $OutDir "apple-touch-icon.png")
  Save-Png -BaseSquare $base512 -Size 192 -OutPath (Join-Path $OutDir "android-chrome-192x192.png")
  Save-Png -BaseSquare $base512 -Size 512 -OutPath (Join-Path $OutDir "android-chrome-512x512.png")

  # favicon.ico from 32x32 bitmap
  $bmp32 = New-Object System.Drawing.Bitmap 32, 32
  $g2 = [System.Drawing.Graphics]::FromImage($bmp32)
  try {
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g2.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g2.Clear([System.Drawing.Color]::Transparent)
    $g2.DrawImage($base512, 0, 0, 32, 32)

    $icoPath = Join-Path $OutDir "favicon.ico"
    $icon = [System.Drawing.Icon]::FromHandle($bmp32.GetHicon())
    $fs = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
    try { $icon.Save($fs) } finally { $fs.Close() }
  }
  finally {
    $g2.Dispose()
    $bmp32.Dispose()
  }
}
finally {
  if ($base512) { $base512.Dispose() }
}

Write-Host "Favicons written to '$OutDir'."
