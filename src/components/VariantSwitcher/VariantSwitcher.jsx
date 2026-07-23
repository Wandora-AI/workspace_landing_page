import { VARIANTS, useVariant } from "../../variants/VariantContext";
import "./VariantSwitcher.css";

export default function VariantSwitcher() {
  const { variant, setVariant } = useVariant();

  return (
    <div className="variant-switcher" role="group" aria-label="Interface style">
      <span className="variant-switcher__label">Style</span>
      {VARIANTS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={
            option.id === variant
              ? "variant-switcher__option variant-switcher__option--active"
              : "variant-switcher__option"
          }
          onClick={() => setVariant(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
