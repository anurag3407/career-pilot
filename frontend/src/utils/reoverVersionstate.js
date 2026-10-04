export const recoverVersionState = (
  versions = []
) => {
  if (!versions.length) {
    return null;
  }

  return versions[versions.length - 1];
};