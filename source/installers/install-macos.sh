#!/usr/bin/env bash
set -euo pipefail

profile_name="CRUXIDE"
extension_id="cruxcode.cruxide"
extension_pack_ids=(
  "dbaeumer.vscode-eslint"
  "esbenp.prettier-vscode"
  "editorconfig.editorconfig"
  "stylelint.vscode-stylelint"
  "davidanson.vscode-markdownlint"
  "angular.ng-template"
  "johnpapa.angular2"
  "bradlc.vscode-tailwindcss"
  "dsznajder.es7-react-js-snippets"
  "jundat95.react-native-snippet"
  "pulkitgangwar.nextjs-snippets"
  "suhelmakkad.shadcn-ui"
  "anbuselvanrocky.bootstrap5-vscode"
  "p-de-jong.vscode-html-scss"
  "mrmlnc.vscode-scss"
  "xabikos.javascriptsnippets"
  "steoates.autoimport"
  "formulahendry.auto-rename-tag"
  "naumovs.color-highlight"
  "imgildev.vscode-nestjs-snippets-extension"
  "imgildev.vscode-nestjs-generator"
  "Compulim.vscode-express"
  "chris-noring.node-snippets"
  "humao.rest-client"
  "ms-playwright.playwright"
  "ms-azuretools.vscode-containers"
  "ms-vscode-remote.remote-containers"
  "redhat.vscode-yaml"
  "github.vscode-github-actions"
  "github.vscode-pull-request-github"
  "github.copilot-chat"
  "eamodio.gitlens"
  "donjayamanne.git-extension-pack"
  "mhutchie.git-graph"
  "donjayamanne.githistory"
  "ms-vsliveshare.vsliveshare"
  "figma.figma-vscode-extension"
  "openai.chatgpt"
  "anthropic.claude-code"
  "aaron-bond.better-comments"
  "streetsidesoftware.code-spell-checker"
  "nhoizey.gremlins"
  "christian-kohler.npm-intellisense"
  "christian-kohler.path-intellisense"
  "quicktype.quicktype"
  "mariusalchimavicius.json-to-ts"
  "aykutsarac.jsoncrack-vscode"
  "mechatroner.rainbow-csv"
  "alefragnani.separators"
  "cpmcgrath.codealignment-vscode"
  "kisstkondoros.vscode-codemetrics"
  "bracketpaircolordlw.bracket-pair-color-dlw"
  "alefragnani.project-manager"
  "jmkrivocapich.drawfolderstructure"
  "adpyke.codesnap"
  "simonsiefke.svg-preview"
  "wayou.vscode-todo-highlight"
  "gruntfuggly.todo-tree"
  "UltraByteSoftwares.markdown-tree"
  "shd101wyy.markdown-preview-enhanced"
  "pkief.material-icon-theme"
)
version="1.0.1"
package_root="$(cd "$(dirname "$0")" && pwd)"
vsix_path="$package_root/cruxide-$version.vsix"
logo_path="$package_root/crux-logo.png"
checksum_path="$package_root/SHA256SUMS.txt"
regular_font_path="$package_root/fonts/RobotoMono-Variable.ttf"
italic_font_path="$package_root/fonts/RobotoMono-Italic-Variable.ttf"
app_path="$HOME/Applications/CRUXIDE.app"
should_launch=true

if [[ "${1:-}" == "--no-launch" ]]; then
  should_launch=false
elif [[ $# -gt 0 ]]; then
  echo "Usage: ./install-macos.sh [--no-launch]" >&2
  exit 2
fi

if ! command -v code >/dev/null 2>&1; then
  echo "The 'code' command was not found. In VS Code, run: Shell Command: Install 'code' command in PATH" >&2
  exit 1
fi

ensure_profile() {
  local code_cli="$1"
  if "$code_cli" --profile "$profile_name" --list-extensions >/dev/null 2>&1; then
    return
  fi

  echo "Creating the $profile_name VS Code profile..."
  if ! "$code_cli" --profile "$profile_name" --new-window --skip-add-to-recently-opened >/dev/null 2>&1; then
    echo "VS Code could not create the $profile_name profile." >&2
    exit 1
  fi

  for _ in {1..20}; do
    if "$code_cli" --profile "$profile_name" --list-extensions >/dev/null 2>&1; then
      return
    fi
    sleep 0.5
  done

  echo "The $profile_name profile was launched but could not be verified after 10 seconds." >&2
  exit 1
}

extension_is_available() {
  local extension_id_to_check="$1"
  local normalized_id
  local located_output
  local candidate
  normalized_id="$(printf '%s' "$extension_id_to_check" | tr '[:upper:]' '[:lower:]')"
  if grep -Fqx "$normalized_id" <<<"$installed_ids"; then
    return 0
  fi

  # Application-scoped built-ins are not included in --list-extensions.
  located_output="$("$code_cli" --profile "$profile_name" --locate-extension "$extension_id_to_check" 2>/dev/null || true)"
  while IFS= read -r candidate; do
    candidate="${candidate%$'\r'}"
    if [[ -n "$candidate" && -e "$candidate" ]]; then
      return 0
    fi
  done <<<"$located_output"
  return 1
}

platform_provided_ids=()
platform_provides() {
  local expected="$1"
  local provided
  for provided in "${platform_provided_ids[@]}"; do
    if [[ "$provided" == "$expected" ]]; then return 0; fi
  done
  return 1
}

for required_file in "$vsix_path" "$logo_path" "$regular_font_path" "$italic_font_path" "$checksum_path"; do
  if [[ ! -f "$required_file" ]]; then
    echo "Missing release file: $required_file" >&2
    exit 1
  fi
done

for verified_file in "$vsix_path" "$logo_path" "$regular_font_path" "$italic_font_path"; do
  manifest_name="${verified_file#"$package_root"/}"
  expected_hash="$(awk -v file="$manifest_name" '$2 == file || $2 == "*" file { print $1; exit }' "$checksum_path")"
  if [[ ! "$expected_hash" =~ ^[[:xdigit:]]{64}$ ]]; then
    echo "No valid checksum was found for $(basename "$verified_file")." >&2
    exit 1
  fi

  actual_hash="$(shasum -a 256 "$verified_file" | awk '{print $1}')"
  actual_hash_normalized="$(printf '%s' "$actual_hash" | tr '[:upper:]' '[:lower:]')"
  expected_hash_normalized="$(printf '%s' "$expected_hash" | tr '[:upper:]' '[:lower:]')"
  if [[ "$actual_hash_normalized" != "$expected_hash_normalized" ]]; then
    echo "Checksum verification failed for $(basename "$verified_file"). Do not install this package." >&2
    exit 1
  fi
done

code_cli="$(command -v code)"
ensure_profile "$code_cli"
"$code_cli" --profile "$profile_name" --install-extension "$vsix_path" --force

installed_ids="$("$code_cli" --profile "$profile_name" --list-extensions | tr '[:upper:]' '[:lower:]')"
for required_id in "${extension_pack_ids[@]}"; do
  required_id_normalized="$(printf '%s' "$required_id" | tr '[:upper:]' '[:lower:]')"
  if ! grep -Fqx "$required_id_normalized" <<<"$installed_ids"; then
    if extension_is_available "$required_id"; then
      echo "Using application-provided developer tool: $required_id"
      platform_provided_ids+=("$required_id_normalized")
      continue
    fi
    echo "Installing required developer tool: $required_id"
    if tool_output="$("$code_cli" --profile "$profile_name" --install-extension "$required_id" 2>&1)"; then
      printf '%s\n' "$tool_output"
    else
      tool_status=$?
      printf '%s\n' "$tool_output" >&2
      if [[ "$required_id_normalized" == "github.copilot-chat" &&
            "$tool_output" == *"is a built-in extension with version"* &&
            "$tool_output" == *"cannot be downgraded"* ]]; then
        echo "Using the newer GitHub Copilot Chat bundled with VS Code."
        platform_provided_ids+=("$required_id_normalized")
      else
        echo "Required extension $required_id failed to install (exit code $tool_status)." >&2
        exit "$tool_status"
      fi
    fi
  fi
done

installed_ids="$("$code_cli" --profile "$profile_name" --list-extensions | tr '[:upper:]' '[:lower:]')"
for required_id in "$extension_id" "${extension_pack_ids[@]}"; do
  required_id_normalized="$(printf '%s' "$required_id" | tr '[:upper:]' '[:lower:]')"
  if ! grep -Fqx "$required_id_normalized" <<<"$installed_ids" &&
     ! platform_provides "$required_id_normalized" &&
     ! extension_is_available "$required_id"; then
    echo "VS Code completed without error, but $required_id was not found in the $profile_name profile." >&2
    exit 1
  fi
done

font_destination="$HOME/Library/Fonts"
mkdir -p "$font_destination"
cp "$regular_font_path" "$font_destination/RobotoMono-Variable.ttf"
cp "$italic_font_path" "$font_destination/RobotoMono-Italic-Variable.ttf"

mkdir -p "$app_path/Contents/MacOS" "$app_path/Contents/Resources"
iconset_root="$(mktemp -d)"
iconset_dir="$iconset_root/CRUXIDE.iconset"
cleanup() {
  if [[ -n "$iconset_root" && -d "$iconset_root" ]]; then
    rm -rf -- "$iconset_root"
  fi
}
trap cleanup EXIT
mkdir -p "$iconset_dir"

for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$logo_path" --out "$iconset_dir/icon_${size}x${size}.png" >/dev/null
  double_size=$((size * 2))
  sips -z "$double_size" "$double_size" "$logo_path" --out "$iconset_dir/icon_${size}x${size}@2x.png" >/dev/null
done

iconutil -c icns "$iconset_dir" -o "$app_path/Contents/Resources/CRUXIDE.icns"

cat > "$app_path/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDisplayName</key><string>CRUXIDE</string>
  <key>CFBundleExecutable</key><string>CRUXIDE</string>
  <key>CFBundleIconFile</key><string>CRUXIDE</string>
  <key>CFBundleIdentifier</key><string>com.cruxcode.cruxide.launcher</string>
  <key>CFBundleName</key><string>CRUXIDE</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0.1</string>
</dict>
</plist>
PLIST

cat > "$app_path/Contents/MacOS/CRUXIDE" <<LAUNCHER
#!/usr/bin/env bash
exec "$code_cli" --profile "$profile_name" --new-window "\$@"
LAUNCHER

chmod 0755 "$app_path/Contents/MacOS/CRUXIDE"
touch "$app_path"

echo "CRUXIDE installed and verified at: $app_path"
echo "Your normal VS Code profile was not replaced."
if [[ "$should_launch" == true ]]; then
  open "$app_path"
fi
