Add-Type -AssemblyName System.Drawing

# Turn the Korean wordmark into outlines, so the SVG needs no client fonts.
function Convert-WordToPath([string]$Word) {
    $fontFamily = [System.Drawing.FontFamily]::new('Malgun Gothic')
    $glyphPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $glyphPath.AddString($Word, $fontFamily, [int][System.Drawing.FontStyle]::Bold, 42, [System.Drawing.PointF]::new(0,0), [System.Drawing.StringFormat]::GenericTypographic)
    $points = $glyphPath.PathPoints
    $types = $glyphPath.PathTypes
    $segments = [System.Collections.Generic.List[string]]::new()
    $culture = [System.Globalization.CultureInfo]::InvariantCulture
    function Format-Point($point) { $point.X.ToString('0.###', $culture) + ' ' + $point.Y.ToString('0.###', $culture) }
    for ($i = 0; $i -lt $points.Length; $i++) {
        $type = $types[$i] -band 7
        if ($type -eq 0) { $segments.Add('M' + (Format-Point $points[$i])) }
        elseif ($type -eq 1) { $segments.Add('L' + (Format-Point $points[$i])) }
        elseif ($type -eq 3) {
            $segments.Add('C' + (Format-Point $points[$i]) + ' ' + (Format-Point $points[$i+1]) + ' ' + (Format-Point $points[$i+2]))
            $i += 2
        }
        if (($types[$i] -band 128) -ne 0) { $segments.Add('Z') }
    }
    $glyphPath.Dispose()
    $fontFamily.Dispose()
    return $segments -join ''
}

$symbol = '<path d="M24 6v15c0 10 9 15 17 10 11-7 24 0 23 15-1 16-18 25-30 17-8-5-15-3-15 6v5H9v-6c0-15 12-22 23-15 8 5 18 0 20-9 1-7-4-11-9-8-13 8-29 0-29-15V6Z" fill="#3472b9"/>'
$brandSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" role="img" aria-label="서울바른내과"><title>서울바른내과</title>'
$brandSvg += $symbol
$brandSvg += '<g transform="translate(84 2)"><path fill="#263e56" d="' + (Convert-WordToPath '서울') + '"/><path transform="translate(84 0)" fill="#3472b9" d="' + (Convert-WordToPath '바른') + '"/><path transform="translate(168 0)" fill="#263e56" d="' + (Convert-WordToPath '내과') + '"/></g>'
$brandSvg += '<text x="87" y="65" fill="#687b8c" font-family="Arial,sans-serif" font-size="8.5" letter-spacing="1.8">SEOUL BARUN MEDICAL CLINIC</text></svg>'
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'public/images/demo1-brand/seoul-bareun-logo.svg'), $brandSvg)
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'public/images/demo1-brand/symbol.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 0 66 80"><title>서울바른내과 심볼</title>' + $symbol + '</svg>')
Write-Output 'Created blue internal-medicine symbol and outlined Korean wordmark.'
