$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDirectory = Join-Path $projectRoot 'backend'
$frontendDirectory = Join-Path $projectRoot 'frontend'
$logDirectory = Join-Path $projectRoot '.dev-logs'
$secretDirectory = Join-Path $projectRoot '.dev-secrets'
$passwordFile = Join-Path $secretDirectory 'postgres-password.clixml'
$backendProcess = $null
$backendStartedHere = $false

function Test-LocalPort {
    param([int]$Port)

    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.ConnectAsync('127.0.0.1', $Port)
        return $connection.Wait(300) -and $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Find-JavaHome {
    if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\javac.exe'))) {
        return $env:JAVA_HOME
    }

    $jdkRoot = Join-Path $env:USERPROFILE '.jdks'
    if (Test-Path $jdkRoot) {
        $jdk = Get-ChildItem $jdkRoot -Directory |
            Where-Object { Test-Path (Join-Path $_.FullName 'bin\javac.exe') } |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1
        if ($jdk) {
            return $jdk.FullName
        }
    }

    throw 'JDK lama helin. IntelliJ ka hubi Project SDK-ga ama JAVA_HOME.'
}

function Find-Maven {
    $systemMaven = Get-Command 'mvn.cmd' -ErrorAction SilentlyContinue
    if ($systemMaven) {
        return $systemMaven.Source
    }

    $jetBrainsRoot = Join-Path $env:ProgramFiles 'JetBrains'
    if (Test-Path $jetBrainsRoot) {
        $bundledMaven = Get-ChildItem $jetBrainsRoot -Recurse -Filter 'mvn.cmd' -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -like '*\plugins\maven\lib\maven3\bin\mvn.cmd' } |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1
        if ($bundledMaven) {
            return $bundledMaven.FullName
        }
    }

    throw 'Maven lama helin. IntelliJ IDEA ama Maven rakib.'
}

function Stop-StartedBackend {
    if (-not $backendStartedHere -or -not $backendProcess) {
        return
    }

    $runningProcess = Get-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
    if ($runningProcess) {
        & taskkill.exe /PID $backendProcess.Id /T /F 2>$null | Out-Null
    }
}

$npm = Get-Command 'npm.cmd' -ErrorAction SilentlyContinue
if (-not $npm) {
    throw 'npm lama helin. Node.js rakib ama PATH-ka sax.'
}

$env:JAVA_HOME = Find-JavaHome
$maven = Find-Maven
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

try {
    if (-not (Test-LocalPort -Port 8080)) {
        if (-not $env:DB_PASSWORD) {
            New-Item -ItemType Directory -Path $secretDirectory -Force | Out-Null
            if (Test-Path $passwordFile) {
                $securePassword = Import-Clixml -LiteralPath $passwordFile
            }
            else {
                Write-Host 'Enter the password you created for the local PostgreSQL user "postgres".' -ForegroundColor Yellow
                $securePassword = Read-Host 'PostgreSQL password' -AsSecureString
                $securePassword | Export-Clixml -LiteralPath $passwordFile
            }

            $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
            try {
                $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
            }
            finally {
                [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
            }
        }

        Write-Host 'Starting Spring Boot backend on http://localhost:8080 ...' -ForegroundColor Cyan
        $backendLog = Join-Path $logDirectory 'backend.log'
        $backendErrorLog = Join-Path $logDirectory 'backend-error.log'
        $backendProcess = Start-Process -FilePath $maven `
            -ArgumentList @('--batch-mode', 'spring-boot:run') `
            -WorkingDirectory $backendDirectory `
            -WindowStyle Hidden `
            -RedirectStandardOutput $backendLog `
            -RedirectStandardError $backendErrorLog `
            -PassThru
        $backendStartedHere = $true

        $deadline = (Get-Date).AddMinutes(3)
        while (-not (Test-LocalPort -Port 8080)) {
            if ($backendProcess.HasExited) {
                Write-Host 'Backend failed to start:' -ForegroundColor Red
                Get-Content $backendLog -Tail 30 -ErrorAction SilentlyContinue
                Get-Content $backendErrorLog -Tail 30 -ErrorAction SilentlyContinue
                if ((Get-Content $backendLog -Raw -ErrorAction SilentlyContinue) -match 'password authentication failed') {
                    Remove-Item -LiteralPath $passwordFile -Force -ErrorAction SilentlyContinue
                    Write-Host 'The saved PostgreSQL password was rejected. Run npm run dev again to enter the correct password.' -ForegroundColor Yellow
                }
                exit 1
            }
            if ((Get-Date) -gt $deadline) {
                Write-Host "Backend startup timed out. See $backendLog" -ForegroundColor Red
                exit 1
            }
            Start-Sleep -Seconds 2
        }
        Write-Host 'Backend is ready.' -ForegroundColor Green
    }
    else {
        Write-Host 'Backend is already running on port 8080.' -ForegroundColor Green
    }

    Write-Host 'Starting React at http://localhost:5173 ...' -ForegroundColor Cyan
    Set-Location $frontendDirectory
    & $npm.Source run dev:frontend
}
finally {
    Stop-StartedBackend
}
