export const isValidVersion = (version) => {
  return Boolean(version && version.id);
};

export const assertValidVersion = (version) => {
  if (!isValidVersion(version)) {
    throw new Error("Invalid resume version state");
  }

  return version;
};