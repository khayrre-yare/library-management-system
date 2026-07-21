$ErrorActionPreference = 'Stop'

$taskName = 'Jamhuuriyo Library Auto Start'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$startScript = Join-Path $projectRoot 'start-dev.ps1'
$passwordFile = Join-Path $projectRoot '.dev-secrets\postgres-password.clixml'

if (-not (Test-Path $startScript)) {
    throw "Startup script not found: $startScript"
}

if (-not (Test-Path $passwordFile)) {
    throw 'PostgreSQL password is not saved yet. Run start-dev.cmd once, enter the password, then run this installer again.'
}

$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$escapedScript = '"' + $startScript + '"'
$actionArguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File $escapedScript"

$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $actionArguments
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $currentUser
$principal = New-ScheduledTaskPrincipal `
    -UserId $currentUser `
    -LogonType Interactive `
    -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -MultipleInstances IgnoreNew

$task = New-ScheduledTask `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Description 'Starts the Jamhuuriyo Library Spring Boot backend and React frontend when this Windows user signs in.'

Register-ScheduledTask -TaskName $taskName -InputObject $task -Force | Out-Null
Start-ScheduledTask -TaskName $taskName

Write-Host 'Jamhuuriyo Library auto-start is installed and has been started.' -ForegroundColor Green
Write-Host 'The application will start automatically whenever you sign in to Windows.' -ForegroundColor Green
