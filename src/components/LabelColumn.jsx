import React from "react";

const LabelColumn = React.memo(({ numRows }) => {
  const labelCells = [];
  for (let r = 0; r < numRows; r++) {
    labelCells.push(
      <div key={r} className="label-cell">
        {`Label ${r + 1}`}
      </div>
    );
  }
  return <div className="label-column">{labelCells}</div>;
});

export default LabelColumn;
