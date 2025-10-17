import React, { useState, useEffect, useRef } from "react";

const Cell = React.memo(
  ({
    rIndex,
    cIndex,
    value,
    isSelected,
    isEditing,
    onSelect,
    onDoubleClick,
    onUpdate,
    onCancel,
  }) => {
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);

    // Sync internal state when external value changes (e.g., paste)
    useEffect(() => {
      if (!isEditing) {
        setTempValue(value);
      }
    }, [value, isEditing]);

    // Focus the input when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleBlur = () => {
      onUpdate(rIndex, cIndex, tempValue);
    };

    const handleKeyDown = (e) => {
      if (isEditing) {
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          onUpdate(rIndex, cIndex, tempValue, e.key);
        } else if (e.key === "Escape") {
          e.stopPropagation();
          onCancel(rIndex, cIndex);
          setTempValue(value);
        }
      }
    };

    const handleMouseDown = (e) => {
      if (!isEditing) {
        onSelect(rIndex, cIndex, false);
      }
    };

    if (isEditing) {
      return (
        <div className="cell cell-editing" onKeyDown={handleKeyDown}>
          <input
            ref={inputRef}
            type="text"
            className="cell-input"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      );
    }

    const className = `cell ${isSelected ? "cell-selected" : ""}`;

    return (
      <div
        className={className}
        style={{ minWidth: "100px" }}
        onMouseDown={handleMouseDown}
        onMouseOver={() => onSelect(rIndex, cIndex, true)}
        onDoubleClick={() => onDoubleClick(rIndex, cIndex)}
      >
        {value}
      </div>
    );
  }
);

export default Cell;
