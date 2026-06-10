// backend/src/utils/faviconGenerator.js

function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function generateColor(name = "") {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 65%, 50%)`;
}

function generateFavicon(name = "") {
  const initials = getInitials(name);
  const backgroundColor = generateColor(name);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="${backgroundColor}" />
      <text
        x="16"
        y="21"
        text-anchor="middle"
        fill="white"
        font-family="Arial, sans-serif"
        font-size="${initials.length === 1 ? 14 : 12}"
        font-weight="bold"
      >${initials}</text>
    </svg>
  `.trim();

  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return {
    svg,
    dataUri,
  };
}

/*
 Small verification test:

 console.log(generateFavicon("John Doe"))
 console.log(generateFavicon("Alice"))
*/

export {generateFavicon};

