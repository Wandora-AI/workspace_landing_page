const ICONS = {
  globe: "🌐",
  map: "🗺️",
  bag: "🛍️",
  store: "🏪",
  chart: "📊",
  headset: "🎧",
  default: "📱",
};

export function getIconEmoji(iconKey) {
  return ICONS[iconKey] || ICONS.default;
}

export const ICON_OPTIONS = Object.keys(ICONS).filter((key) => key !== "default");
