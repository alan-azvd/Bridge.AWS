Write-Host "Setting .nuspec version tag to $env:APPVEYOR_BUILD_VERSION"

$content = (Get-Content src/Bridge.AWS.nuspec) 
$content = $content -replace '\$version\$',$env:APPVEYOR_BUILD_VERSION

$content | Out-File src/Bridge.AWS.nuspec

nuget pack src/Bridge.AWS.csproj