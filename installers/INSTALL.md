# Install CRUXIDE 1.0.0

Download the versioned `CRUXIDE-v1.0.0.zip` asset from [GitHub Releases](https://github.com/mohamed-abdelfattah-frontend/CRUXIDE/releases). Do not use GitHub's **Code → Download ZIP** source archive; it is source code, not an installable release.

Do not run an installer directly from inside the ZIP. Extract the entire archive first so the VSIX, icon, and checksum manifest stay together.

## Windows

Open PowerShell in the extracted `CRUXIDE-v1.0.0` folder. In File Explorer, open that folder, click the address bar, type `powershell`, and press Enter. Then run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\install-windows.ps1
```

For installation without launching the new window:

```powershell
.\install-windows.ps1 -NoLaunch
```

The installer uses an isolated `cmd.exe` child process to run `code.cmd`, so harmless Node warnings on stderr cannot become PowerShell `NativeCommandError` exceptions or blank exit codes. It confirms the CLI belongs to the same Microsoft-signed VS Code installation, creates the profile when missing, verifies CRUXIDE, installs Roboto Mono for the current Windows user, and creates CRUX-branded Desktop and Start Menu shortcuts targeting `Code.exe`.

After launch, open **CRUXIDE: Setup & Manage Tracks**. All tracks are selected initially; uncheck anything you do not need, review the plan, and confirm before VS Code downloads track-specific extensions.

## macOS

In VS Code, first run **Shell Command: Install 'code' command in PATH**. Then:

```bash
chmod +x ./install-macos.sh
./install-macos.sh
```

Use `./install-macos.sh --no-launch` to install without opening CRUXIDE.

## Manual VSIX

```bash
code --profile "CRUXIDE" --new-window
code --profile "CRUXIDE" --install-extension ./cruxide-1.0.0.vsix --force
code --profile "CRUXIDE" --list-extensions
code --profile "CRUXIDE" --new-window
```

The list must contain `cruxcode.cruxide`. Track-specific extensions appear only after they are selected and confirmed in CRUXIDE Setup.

## Checksum verification

Windows:

```powershell
Get-FileHash .\cruxide-1.0.0.vsix -Algorithm SHA256
```

macOS:

```bash
shasum -a 256 ./cruxide-1.0.0.vsix
```

Compare the result with `SHA256SUMS.txt` included in the release.
