import React, { useState, useCallback, useEffect } from "react";
import HeaderRow from "./HeaderRow";
import LabelColumn from "./LabelColumn";
import Cell from "./Cell";

const DataGrid = () => {
  const initialData = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];
  const [data, setData] = useState(initialData);
  const [numRows, setNumRows] = useState(initialData.length);
  const [numCols, setNumCols] = useState(initialData[0].length);
  const [selection, setSelection] = useState({ start: null, end: null });
  const [editingCell, setEditingCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  console.log("selection", selection);

  const getRange = useCallback((sel) => {
    // console.log("select : ", sel);
    if (!sel.start) return { r1: -1, c1: -1, r2: -1, c2: -1 };
    const { r: rStart, c: cStart } = sel.start;
    const { r: rEnd, c: cEnd } = sel.end || sel.start;

    return {
      r1: Math.min(rStart, rEnd),
      c1: Math.min(cStart, cEnd),
      r2: Math.max(rStart, rEnd),
      c2: Math.max(cStart, cEnd),
    };
  }, []);

  const isCellSelected = useCallback(
    (r, c) => {
      // console.log("r : ", r, "c : ", c);
      const { r1, c1, r2, c2 } = getRange(selection);
      return r >= r1 && r <= r2 && c >= c1 && c <= c2;
    },
    [selection, getRange]
  );

  const updateChange = useCallback(
    (r, c, newValue, nextMove) => {
      setData((prevData) => {
        const newData = prevData.map((row) => [...row]);
        newData[r][c] = newValue;
        return newData;
      });
      setEditingCell(null);

      if (nextMove === "Enter") {
        const nextRow = Math.min(r + 1, numRows - 1);
        setSelection({ start: { r: nextRow, c }, end: { r: nextRow, c } });
        // handleDoubleClick(nextR, c);
      } else if (nextMove === "Tab") {
        const nextC = Math.min(c + 1, numCols - 1);
        setSelection({ start: { r, c: nextC }, end: { r: nextRow, c } });
      }
    },
    [numRows, numCols]
  );

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  // add row and col

  const handleAddRow = useCallback(() => {
    setData((prevData) => {
      const newRow = Array(numCols).fill("");
      return [...prevData, newRow];
    });
    setNumRows((prevNumRows) => prevNumRows + 1);
  }, [numCols]);

  const handleAddColumn = useCallback(() => {
    setData((prevData) => prevData.map((row) => [...row, ""]));
    setNumCols((prevNumCols) => prevNumCols + 1);
  }, []);

  // select and edit

  const handleSelect = useCallback(
    (r, c, isDraggingOver = false) => {
      if (editingCell) return;

      if (isDraggingOver) {
        if (isDragging) {
          setSelection((prevSel) => ({ ...prevSel, end: { r, c } }));
        }
      } else {
        // Mouse Down: Start selection
        setSelection({ start: { r, c }, end: { r, c } });
        setIsDragging(true);
      }
    },
    [editingCell, isDragging]
  );

  const handleDoubleClick = useCallback((r, c) => {
    setEditingCell({ r, c });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  // copy and paste

  const handleCopy = useCallback(
    (isCut = false) => {
      const { r1, c1, r2, c2 } = getRange(selection);
      if (r1 === -1) return;

      let tsv = "";

      for (let r = r1; r <= r2; r++) {
        const rowData = [];
        for (let c = c1; c <= c2; c++) {
          rowData.push(data[r][c]);
        }
        tsv += rowData.join("\t") + (r < r2 ? "\n" : "");
      }

      navigator.clipboard.writeText(tsv);
    },
    [selection, data, getRange]
  );

  const handlePaste = useCallback(
    async (e) => {
      e.preventDefault();
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText || !selection.start) return;

      const pasteRows = clipboardText.split("\n").map((row) => row.split("\t"));
      const pasteH = pasteRows.length;
      const pasteW = pasteRows[0].length;
      const { r: rStart, c: cStart } = selection.start;

      let newR = numRows;
      let newC = numCols;

      const requiredRows = rStart + pasteH;
      const requiredCols = cStart + pasteW;

      if (requiredRows > numRows) newR = requiredRows;
      if (requiredCols > numCols) newC = requiredCols;

      setData((prevData) => {
        let newData = prevData.map((row) => [...row]);

        for (let c = numCols; c < newC; c++) {
          newData = newData.map((row) => [...row, ""]);
        }

        for (let r = numRows; r < newR; r++) {
          newData.push(Array(newC).fill(""));
        }

        for (let r = 0; r < pasteH; r++) {
          for (let c = 0; c < pasteW; c++) {
            if (
              newData[rStart + r] &&
              newData[rStart + r][cStart + c] !== undefined
            ) {
              newData[rStart + r][cStart + c] = pasteRows[r][c] || "";
            }
          }
        }
        return newData;
      });

      if (newR > numRows) setNumRows(newR);
      if (newC > numCols) setNumCols(newC);

      setSelection({
        start: { r: rStart, c: cStart },
        end: { r: rStart + pasteH - 1, c: cStart + pasteW - 1 },
      });
    },
    [selection, numRows, numCols]
  );

  //keyboard key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "c" || e.key === "C") {
          handleCopy(false);
          e.preventDefault();
        }
      }
    };

    const handleGlobalPaste = (e) => {
      if (!editingCell) {
        handlePaste(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handleGlobalPaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, [handleCopy, handlePaste, editingCell]);

  // grid css
  const gridBodyStyle = {
    gridTemplateColumns: `repeat(${numCols}, 100px)`,
    width: `${numCols * 100}px`,
  };

  return (
    <div className="datagrid-container">
      <div className="controls">
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleAddColumn}>Add Column</button>
      </div>

      <div style={{ display: "flex" }}>
        <HeaderRow numCols={numCols} />
      </div>

      <div className="grid-content-area">
        <LabelColumn numRows={numRows} />

        <div className="grid-body" style={gridBodyStyle}>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((value, colIndex) => (
                <Cell
                  key={colIndex}
                  rIndex={rowIndex}
                  cIndex={colIndex}
                  value={value}
                  isSelected={isCellSelected(rowIndex, colIndex)}
                  isEditing={
                    editingCell?.r === rowIndex && editingCell?.c === colIndex
                  }
                  onSelect={handleSelect}
                  onDoubleClick={handleDoubleClick}
                  onUpdate={updateChange}
                  onCancel={cancelEdit}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
