Write-Host "Configuring appsettings.json"

# Read appsettings.json
function Get-ScriptDirectory { Split-Path $MyInvocation.ScriptName }
$appsettingsPath = Join-Path (Get-ScriptDirectory) 'template.env'
$appsettings = Get-Content $appsettingsPath -Raw

#Replace values for sharepoint
Write-Host "Please provide the following settings to configure the application"

$site = Read-Host "The name of this site/location"
$appsettings = $appsettings -replace "SITE=", "SITE=$site"

$orgHost = Read-Host "The organisation host to connect to"
$appsettings = $appsettings -replace "ORG_HOST=", "ORG_HOST=$orgHost"

$enableQnAMaker = Read-Host "Would you like to connect Sight++ to an Azure QnA Maker service to enable ChatBot capabilities?`n([Y]es/[N]o)"
If ($enableQnAMaker.ToUpper() -match "Y" -or $enableQnAMaker.ToUpper() -match "YES") {
    $kbHost = Read-Host "Your Knowledge Base host (e.g. https://my-knowledge-base.azurewebsites.net)"
    $appsettings = $appsettings -replace "KB_HOST=", "KB_HOST=$kbHost"
    
    $kbEndpointKey = Read-Host "Your Knowledge Base Endpoint Key (e.g. 25a398e6-5775-4c42-7562-a040fbb090a9)"
    $appsettings = $appsettings -replace "KB_ENDPOINT_KEY=", "KB_ENDPOINT_KEY=$kbEndpointKey"
    
    $kbId = Read-Host "Your Knowledge Base ID (e.g. 40a7fbf8-3d63-45ab-bc24-0a4gafb505f5)"
    $appsettings = $appsettings -replace "KB_ID=", "KB_ID=$kbId"
}

# Replace values for database
$enableDatabase = Read-Host "Would you like to setup a username and a password for the MongoDB?`n([Y]es/[N]o)"
If ($enableDatabase.ToUpper() -match "Y" -or $enableDatabase.ToUpper() -match "YES") {
    $Uid = Read-Host "Database User ID"
    $appsettings = $appsettings -replace "DATABASE_USER=", "DATABASE_USER=$Uid"

    $Password = Read-Host "Database Password"
    $appsettings = $appsettings -replace "DATABASE_PASSWORD=", "DATABASE_PASSWORD=$Password"
}

$enableDatabase = Read-Host "Would you like to setup SSL for the REST API?`n([Y]es/[N]o). Note: You must have openssl installed"
If ($enableDatabase.ToUpper() -match "Y" -or $enableDatabase.ToUpper() -match "YES") {
    mkdir -p "../certs"
    $sslHost = Read-Host "The host you would like the REST API to run on (e.g IP or domain)"
    openssl req -nodes -new -x509 -keyout ../certs/server.key -out ../certs/server.cert -subj "/C=UK/ST=London/L=London/O=Sight++/OU=LocationServer/CN=$sslHost"
    $appsettings = $appsettings -replace "SSL=", "SSL=YES"
} else {
    $appsettings = $appsettings -replace "SSL=", "SSL=NO"
}

# Write to appsettings.json
$configuredAppsettingsPath = Join-Path (Get-ScriptDirectory) '../.env'
Set-Content -Path $configuredAppsettingsPath -Value $appsettings
Write-Host "Configuration saved to .env"

sleep 10