const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// React Native new arch pulls in folly/coro/coroutine.h which wraps <coroutine>.
// <coroutine> is a C++20 header; CocoaPods defaults to C++17 for many pod targets,
// so Clang reports the file as not found. This hook forces c++20 on every target.
const PATCH_MARKER = '# [withIosCppFlags] c++20 patch';
const PATCH = `
  ${PATCH_MARKER}
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'
    end
  end
`;

function findCallEnd(src, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function patchPodfile(contents) {
  if (contents.includes(PATCH_MARKER)) return contents;

  // Preferred: inject right after react_native_post_install(...)
  const rnpiMarker = 'react_native_post_install(';
  const markerIdx = contents.indexOf(rnpiMarker);
  if (markerIdx !== -1) {
    const callEnd = findCallEnd(contents, markerIdx + rnpiMarker.length - 1);
    if (callEnd !== -1) {
      return contents.slice(0, callEnd + 1) + '\n' + PATCH + contents.slice(callEnd + 1);
    }
  }

  // Fallback: inject at top of post_install block
  const postInstall = 'post_install do |installer|';
  if (contents.includes(postInstall)) {
    return contents.replace(postInstall, postInstall + '\n' + PATCH);
  }

  // Last resort: append a new post_install block
  return contents + `\npost_install do |installer|\n${PATCH}\nend\n`;
}

module.exports = function withIosCppFlags(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) return config;

      const original = fs.readFileSync(podfilePath, 'utf8');
      const patched = patchPodfile(original);
      if (patched !== original) fs.writeFileSync(podfilePath, patched);

      return config;
    },
  ]);
};
