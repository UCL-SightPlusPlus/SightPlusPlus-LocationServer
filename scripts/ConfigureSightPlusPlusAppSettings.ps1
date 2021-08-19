Write-Host "Configuring appsettings.json"

# Read appsettings.json
function Get-ScriptDirectory { Split-Path $MyInvocation.ScriptName }
$appsettingsPath = Join-Path (Get-ScriptDirectory) 'template.env'
$appsettings = Get-Content $appsettingsPath -Raw

#Replace values for sharepoint
Write-Host "Please provide the following settings to configure the application:"

$port = Read-Host "The port you would like the REST API to use:"
$appsettings = $appsettings -replace "PORT=", "PORT=$port"

$udpPort = Read-Host "The UDP port you would like the app to use:"
$appsettings = $appsettings -replace "UDP_PORT", "UDP_PORT=$udpPort"

$enableQnAMaker = Read-Host "Would you like to connect Sight++ to an Azure QnA Maker service to enable ChatBot capabilities?`n([Y]es/[N])o"
If ($enableQnAMaker.ToUpper() -match "Y" -or $enableQnAMaker.ToUpper() -match "YES") {
    $kbHost = Read-Host "Your Knowledge Base host (e.g. https://my-knowledge-base.azurewebsites.net)"
    $appsettings = $appsettings -replace "KB_HOST=", "KB_HOST=$kbHost"
    
    $kbEndpointKey = Read-Host "Your Knowledge Base Endpoint Key (e.g. 25a398e6-5775-4c42-7562-a040fbb090a9)"
    $appsettings = $appsettings -replace "KB_ENDPOINT_KEY=", "KB_ENDPOINT_KEY=$kbEndpointKey"
    
    $kbId = Read-Host "Your Knowledge Base ID (e.g. 40a7fbf8-3d63-45ab-bc24-0a4gafb505f5)"
    $appsettings = $appsettings -replace "KB_ID=", "KB_ID=$kbId"
}

Replace values for database
$enableDatabase = Read-Host "Would you like to setup a username and a password for the MongoDB?`n([Y]es/[N])o"
If ($enableDatabase.ToUpper() -match "Y" -or $enableDatabase.ToUpper() -match "YES") {
    $Uid = Read-Host "Database User ID"
    $appsettings = $appsettings -replace "DATABASE_USER=", "DATABASE_USER=$Uid"

    $Password = Read-Host "Database Password"
    $appsettings = $appsettings -replace "DATABASE_PASSWORD=", "DATABASE_PASSWORD=$Password"
}

# Write to appsettings.json
$configuredAppsettingsPath = Join-Path (Get-ScriptDirectory) '../.env'
Set-Content -Path $configuredAppsettingsPath -Value $appsettings
Write-Host "Configuration saved to .env"