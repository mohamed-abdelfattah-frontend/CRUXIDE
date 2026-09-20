#Requires -Version 5.1
[CmdletBinding()]
param(
    [switch]$NoLaunch
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProfileName = 'CRUXIDE'
$ExtensionId = 'cruxcode.cruxide'
$Version = '1.2.0'
$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$VsixPath = Join-Path $PackageRoot "cruxide-$Version.vsix"
$IconPath = Join-Path $PackageRoot 'cruxide.ico'
$FontRoot = Join-Path $PackageRoot 'fonts'
$RegularFontPath = Join-Path $FontRoot 'RobotoMono-Variable.ttf'
$ItalicFontPath = Join-Path $FontRoot 'RobotoMono-Italic-Variable.ttf'
$ChecksumPath = Join-Path $PackageRoot 'SHA256SUMS.txt'
$InstallRoot = Join-Path $env:LOCALAPPDATA 'CRUXIDE'
$InstalledIconPath = Join-Path $InstallRoot 'cruxide.ico'
function Resolve-CodeCli {
    $candidates = New-Object 'System.Collections.Generic.List[string]'
    if ($env:LOCALAPPDATA) {
        $candidates.Add((Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\bin\code.cmd'))
    }
    if ($env:ProgramFiles) {
        $candidates.Add((Join-Path $env:ProgramFiles 'Microsoft VS Code\bin\code.cmd'))
    }
    if (${env:ProgramFiles(x86)}) {
        $candidates.Add((Join-Path ${env:ProgramFiles(x86)} 'Microsoft VS Code\bin\code.cmd'))
    }

    $command = Get-Command 'code.cmd' -CommandType Application -ErrorAction SilentlyContinue
    if (-not $command) {
        $command = Get-Command 'code' -CommandType Application -ErrorAction SilentlyContinue
    }
    if ($command -and $command.Source) {
        $candidates.Add([string]$command.Source)
    }

    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate -PathType Leaf)) {
            return [string](Resolve-Path -LiteralPath $candidate).Path
        }
    }

    throw "The VS Code command-line interface (code.cmd) was not found. Install Visual Studio Code, then run this installer again."
}

function Confirm-CodeSignature {
    param([Parameter(Mandatory)] [string]$CodeExecutable)

    $signature = Get-AuthenticodeSignature -LiteralPath $CodeExecutable
    $subject = if ($signature.SignerCertificate) { [string]$signature.SignerCertificate.Subject } else { '' }
    if ($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or
        $subject -notmatch '(^|,\s*)(CN|O)=Microsoft Corporation(,|$)') {
        throw "The VS Code executable does not have a valid Microsoft Authenticode signature: $CodeExecutable"
    }
}

function Resolve-CodeExecutable {
    param([Parameter(Mandatory)] [string]$CodeCli)

    $cliRoot = Split-Path (Split-Path $CodeCli -Parent) -Parent
    $candidate = Join-Path $cliRoot 'Code.exe'
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
        return [string](Resolve-Path -LiteralPath $candidate).Path
    }

    throw "The selected VS Code CLI is not paired with Code.exe in the same installation: $CodeCli"
}

function Confirm-ReleaseChecksum {
    param([Parameter(Mandatory)] [string]$FilePath)

    if (-not (Test-Path -LiteralPath $ChecksumPath -PathType Leaf)) {
        throw "Missing checksum manifest: $ChecksumPath"
    }

    $rootPrefix = $PackageRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    if (-not $FilePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Cannot verify a release file outside the extracted package: $FilePath"
    }
    $manifestName = $FilePath.Substring($rootPrefix.Length).Replace([IO.Path]::DirectorySeparatorChar, '/')
    $escapedName = [Regex]::Escape($manifestName)
    $entry = Get-Content -LiteralPath $ChecksumPath | Where-Object {
        $_ -match "^[A-Fa-f0-9]{64}\s+\*?$escapedName$"
    } | Select-Object -First 1

    if (-not $entry) {
        throw "No checksum was found for $manifestName."
    }

    $expected = ([string]$entry -split '\s+')[0].ToLowerInvariant()
    $actual = (Get-FileHash -LiteralPath $FilePath -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $expected) {
        throw "Checksum verification failed for $manifestName. Do not install this package."
    }
}

function ConvertTo-CmdArgument {
    param([Parameter(Mandatory)] [AllowEmptyString()] [string]$Value)

    if ($Value -match '["%\r\n]') {
        throw 'The extracted package path contains an unsupported character (quote, percent sign, or line break). Move the package to a simpler folder and try again.'
    }

    return '"' + $Value + '"'
}

function Invoke-CodeCli {
    param(
        [Parameter(Mandatory)] [string]$CodeCli,
        [Parameter(Mandatory)] [string[]]$Arguments
    )

    if (-not $env:ComSpec -or -not (Test-Path -LiteralPath $env:ComSpec -PathType Leaf)) {
        throw 'Windows Command Processor (cmd.exe) was not found.'
    }

    # Use a child process instead of PowerShell's native pipeline. Windows PowerShell 5
    # otherwise converts harmless VS Code/Node stderr warnings into NativeCommandError
    # and can leave $LASTEXITCODE empty even when installation succeeds.
    $command = (ConvertTo-CmdArgument -Value $CodeCli) + ' ' +
        (($Arguments | ForEach-Object { ConvertTo-CmdArgument -Value ([string]$_) }) -join ' ')
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $env:ComSpec
    $startInfo.Arguments = '/d /s /c "' + $command + '"'
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo
    try {
        if (-not $process.Start()) {
            throw 'VS Code CLI process could not be started.'
        }
        $stdoutTask = $process.StandardOutput.ReadToEndAsync()
        $stderrTask = $process.StandardError.ReadToEndAsync()
        $process.WaitForExit()
        $stdout = $stdoutTask.GetAwaiter().GetResult()
        $stderr = $stderrTask.GetAwaiter().GetResult()
        $exitCode = [int]$process.ExitCode
    }
    finally {
        $process.Dispose()
    }

    $combined = @($stdout, $stderr) -join [Environment]::NewLine
    return [PSCustomObject]@{
        ExitCode = $exitCode
        Output = @($combined -split '\r?\n' | ForEach-Object { $_.TrimEnd() } | Where-Object { $_ })
    }
}

function Get-InstalledExtensionIds {
    param([Parameter(Mandatory)] [string]$CodeCli)

    $result = Invoke-CodeCli -CodeCli $CodeCli -Arguments @('--profile', $ProfileName, '--list-extensions')
    if ($result.ExitCode -ne 0) {
        $result.Output | ForEach-Object { Write-Host $_ }
        throw "VS Code could not list extensions for the $ProfileName profile (exit code $($result.ExitCode))."
    }

    return @($result.Output |
        ForEach-Object { ([string]$_).Trim().ToLowerInvariant() } |
        Where-Object { $_ -match '^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9.-]*$' })
}

function Test-ExtensionAvailable {
    param(
        [Parameter(Mandatory)] [string]$CodeCli,
        [Parameter(Mandatory)] [string]$ExtensionId,
        [Parameter(Mandatory)] [string[]]$InstalledIds
    )

    $normalizedId = $ExtensionId.ToLowerInvariant()
    if ($InstalledIds -contains $normalizedId) {
        return $true
    }

    # New VS Code releases can provide extensions at application scope. Those
    # built-ins are intentionally absent from a profile's --list-extensions.
    $locateResult = Invoke-CodeCli -CodeCli $CodeCli -Arguments @(
        '--profile', $ProfileName, '--locate-extension', $ExtensionId
    )
    if ($locateResult.ExitCode -ne 0) {
        return $false
    }

    foreach ($line in $locateResult.Output) {
        $candidate = ([string]$line).Trim().Trim('"')
        if ($candidate -and (Test-Path -LiteralPath $candidate)) {
            return $true
        }
    }

    return $false
}

function Ensure-CodeProfile {
    param([Parameter(Mandatory)] [string]$CodeCli)

    $profileCheck = Invoke-CodeCli -CodeCli $CodeCli -Arguments @(
        '--profile', $ProfileName, '--list-extensions'
    )
    if ($profileCheck.ExitCode -eq 0) {
        return
    }

    Write-Host "Creating the $ProfileName VS Code profile..." -ForegroundColor Cyan
    $createResult = Invoke-CodeCli -CodeCli $CodeCli -Arguments @(
        '--profile', $ProfileName, '--new-window', '--skip-add-to-recently-opened'
    )
    if ($createResult.ExitCode -ne 0) {
        $createResult.Output | ForEach-Object { Write-Host $_ }
        throw "VS Code could not create the $ProfileName profile (exit code $($createResult.ExitCode))."
    }

    for ($attempt = 1; $attempt -le 20; $attempt += 1) {
        Start-Sleep -Milliseconds 500
        $profileCheck = Invoke-CodeCli -CodeCli $CodeCli -Arguments @(
            '--profile', $ProfileName, '--list-extensions'
        )
        if ($profileCheck.ExitCode -eq 0) {
            return
        }
    }

    throw "The $ProfileName profile was launched but could not be verified after 10 seconds."
}

function Install-RobotoMono {
    $fontDestination = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Fonts'
    $registryPath = 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts'
    if (-not (Test-Path -LiteralPath $fontDestination)) {
        New-Item -ItemType Directory -Path $fontDestination -Force | Out-Null
    }
    if (-not (Test-Path -LiteralPath $registryPath)) {
        New-Item -Path $registryPath -Force | Out-Null
    }

    $fontMappings = @(
        @{ Source = $RegularFontPath; FileName = 'RobotoMono-Variable.ttf'; RegistryName = 'Roboto Mono (TrueType)' },
        @{ Source = $ItalicFontPath; FileName = 'RobotoMono-Italic-Variable.ttf'; RegistryName = 'Roboto Mono Italic (TrueType)' }
    )

    foreach ($font in $fontMappings) {
        $header = [IO.File]::ReadAllBytes([string]$font.Source)[0..3]
        if (($header | ForEach-Object { $_.ToString('X2') }) -join '' -ne '00010000') {
            throw "The bundled font is not a valid TrueType file: $($font.Source)"
        }
        $sourceHash = (Get-FileHash -LiteralPath ([string]$font.Source) -Algorithm SHA256).Hash.ToLowerInvariant()
        $destination = Join-Path $fontDestination ([string]$font.FileName)
        $copyRequired = $true

        if (Test-Path -LiteralPath $destination -PathType Leaf) {
            $destinationHash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
            if ($destinationHash -eq $sourceHash) {
                $copyRequired = $false
                Write-Host "Font already installed: $($font.FileName)" -ForegroundColor DarkCyan
            }
            else {
                $contentAddressedName = "CRUXIDE-$($sourceHash.Substring(0, 12))-$($font.FileName)"
                $destination = Join-Path $fontDestination $contentAddressedName
                if (Test-Path -LiteralPath $destination -PathType Leaf) {
                    $destinationHash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
                    if ($destinationHash -ne $sourceHash) {
                        throw "Existing content-addressed font failed integrity verification: $destination"
                    }
                    $copyRequired = $false
                }
            }
        }

        if ($copyRequired) {
            Copy-Item -LiteralPath ([string]$font.Source) -Destination $destination
        }
        New-ItemProperty -Path $registryPath -Name ([string]$font.RegistryName) -Value $destination -PropertyType String -Force | Out-Null
    }

    if (-not ('CruxideFontBroadcast.NativeMethods' -as [type])) {
        Add-Type -TypeDefinition @'
namespace CruxideFontBroadcast {
    using System;
    using System.Runtime.InteropServices;
    public static class NativeMethods {
        [DllImport("user32.dll", SetLastError = true)]
        public static extern IntPtr SendMessageTimeout(
            IntPtr hWnd, uint message, IntPtr wParam, IntPtr lParam,
            uint flags, uint timeout, out IntPtr result);
    }
}
'@
    }

    $broadcastResult = [IntPtr]::Zero
    [void][CruxideFontBroadcast.NativeMethods]::SendMessageTimeout(
        [IntPtr]0xffff, 0x001D, [IntPtr]::Zero, [IntPtr]::Zero,
        0x0002, 1000, [ref]$broadcastResult
    )
}

function New-CruxShortcut {
    param(
        [Parameter(Mandatory)] [string]$ShortcutPath,
        [Parameter(Mandatory)] [string]$CodeExecutable,
        [Parameter(Mandatory)] [string]$ShortcutIconPath
    )

    $shortcutDirectory = Split-Path $ShortcutPath -Parent
    if (-not (Test-Path -LiteralPath $shortcutDirectory)) {
        New-Item -ItemType Directory -Path $shortcutDirectory -Force | Out-Null
    }

    $shell = $null
    $shortcut = $null
    try {
        $shell = New-Object -ComObject WScript.Shell
        $shortcut = $shell.CreateShortcut($ShortcutPath)
        $shortcut.TargetPath = $CodeExecutable
        $shortcut.Arguments = '--profile "CRUXIDE"'
        $shortcut.WorkingDirectory = Split-Path $CodeExecutable -Parent
        $shortcut.IconLocation = "$ShortcutIconPath,0"
        $shortcut.Description = 'CRUXIDE - The CRUXCODE.DEV developer experience'
        $shortcut.Save()
    }
    finally {
        if ($shortcut) { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($shortcut) }
        if ($shell) { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($shell) }
    }
}

$requiredFiles = @($VsixPath, $IconPath, $RegularFontPath, $ItalicFontPath)
foreach ($requiredFile in $requiredFiles) {
    if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
        throw "Missing release file: $requiredFile"
    }
    Confirm-ReleaseChecksum -FilePath $requiredFile
}

$codeCli = Resolve-CodeCli
$codeExecutable = Resolve-CodeExecutable -CodeCli $codeCli
Confirm-CodeSignature -CodeExecutable $codeExecutable
Ensure-CodeProfile -CodeCli $codeCli

Write-Host 'Installing the CRUXIDE VS Code profile and extension...' -ForegroundColor Cyan
$installResult = Invoke-CodeCli -CodeCli $codeCli -Arguments @(
    '--profile', $ProfileName, '--install-extension', $VsixPath, '--force'
)
$installResult.Output | ForEach-Object { Write-Host $_ }
if ($installResult.ExitCode -ne 0) {
    throw "VS Code extension installation failed with exit code $($installResult.ExitCode)."
}

$installedIds = Get-InstalledExtensionIds -CodeCli $codeCli
$requiredIds = @($ExtensionId)
$unverifiedIds = @($requiredIds | Where-Object {
    $normalizedId = $_.ToLowerInvariant()
    $installedIds -notcontains $normalizedId -and
        -not (Test-ExtensionAvailable -CodeCli $codeCli -ExtensionId $_ -InstalledIds $installedIds)
})
if ($unverifiedIds.Count -gt 0) {
    throw "Installation completed, but these extensions could not be verified: $($unverifiedIds -join ', ')"
}

Write-Host 'Installing Roboto Mono for the editor and terminal...' -ForegroundColor Cyan
Install-RobotoMono

if (-not (Test-Path -LiteralPath $InstallRoot)) {
    New-Item -ItemType Directory -Path $InstallRoot -Force | Out-Null
}
Copy-Item -LiteralPath $IconPath -Destination $InstalledIconPath -Force

$desktopShortcut = Join-Path ([Environment]::GetFolderPath('Desktop')) 'CRUXIDE.lnk'
$startMenuShortcut = Join-Path ([Environment]::GetFolderPath('Programs')) 'CRUXIDE\CRUXIDE.lnk'
New-CruxShortcut -ShortcutPath $desktopShortcut -CodeExecutable $codeExecutable -ShortcutIconPath $InstalledIconPath
New-CruxShortcut -ShortcutPath $startMenuShortcut -CodeExecutable $codeExecutable -ShortcutIconPath $InstalledIconPath

Write-Host 'CRUXIDE installed and verified successfully.' -ForegroundColor Green
Write-Host "Verified extension count: $($requiredIds.Count)"
Write-Host 'Open CRUXIDE Setup in the profile to review and install track-specific developer tools.' -ForegroundColor Cyan
Write-Host "Desktop shortcut: $desktopShortcut"
Write-Host 'Your normal VS Code profile was not replaced.'

if (-not $NoLaunch) {
    Start-Process -FilePath $codeExecutable -ArgumentList @('--profile', $ProfileName, '--new-window')
}
