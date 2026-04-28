$dest = "c:\Users\HP\Desktop\skin disease\Skin disease\backend\public\products"
$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
$client.Headers.Add("Referer", "https://www.google.com")

$files = @(
    @{ url = "https://m.media-amazon.com/images/I/51rYw6tP5sL.jpg"; name = "salicylic-face-wash.jpg" },
    @{ url = "https://m.media-amazon.com/images/I/51X5xJ33s3L.jpg"; name = "niacinamide-serum.jpg" },
    @{ url = "https://m.media-amazon.com/images/I/51r5Y-w-vPL.jpg"; name = "hyaluronic-sunscreen.jpg" },
    @{ url = "https://m.media-amazon.com/images/I/51QdD6eB8-L.jpg"; name = "vitamin-c-serum.jpg" },
    @{ url = "https://5.imimg.com/data5/SELLER/Default/2021/3/XH/ZX/TY/12028681/persol-2-5-gel-500x500.jpg"; name = "benzoyl-peroxide.jpg" },
    @{ url = "https://m.media-amazon.com/images/I/719hB3Sj6mL.jpg"; name = "nizoral-cream.jpg" },
    @{ url = "https://m.media-amazon.com/images/I/81eG9Zg-rWL.jpg"; name = "clotrimazole-cream.jpg" }
)

foreach ($f in $files) {
    try {
        $client.DownloadFile($f.url, "$dest\" + $f.name)
        Write-Output ("Downloaded: " + $f.name)
    } catch {
        Write-Output ("FAILED: " + $f.name + " - " + $_.Exception.Message)
    }
}
Write-Output "All done"
