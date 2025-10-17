import React from "react";

const HeaderRow = React.memo(({ numCols }) => {
  const headerCells = [];
  for (let c = 0; c < numCols; c++) {
    headerCells.push(
      <div key={c} className="header-cell" style={{ minWidth: "100px" }}>
        {`Head ${c + 1}`}
      </div>
    );
  }
  return <div className="header-container">{headerCells}</div>;
});

export default HeaderRow;
