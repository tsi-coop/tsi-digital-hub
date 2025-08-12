import React, { useState } from "react";
import { downward, upward } from "../../../assets";
import colors from "../../../assets/styles/colors";

const TreeView = ({ treeData, title }: any) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<{ key: string; value: string }[]>([]);

  // Toggle expand/collapse
  const handleExpand = (key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Toggle checkbox and update selectedSolutions
  const handleCheck = (node: { key: string; value: string }) => {
    setChecked((prev) =>
      prev.includes(node.key) ? prev.filter((item) => item !== node.key) : [...prev, node.key]
    );

    setSelectedSolutions((prev) => {
      const exists = prev.find((item) => item.key === node.key);
      if (exists) {
        // Remove the item if already selected
        return prev.filter((item) => item.key !== node.key);
      } else {
        // Add the new item if not already selected
        return [...prev, node];
      }
    });
  };

  // Recursive render function
  const renderTree = (nodes: any, isFirstLevel = true) => {
    return (
      <ul style={{ listStyleType: "none", padding: 0, margin: 0, borderRadius: "5px" }}>
        {nodes?.map((node: any, index: any) => (
          <li key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "10px",
                alignItems: "center",
                width: "100%",
                backgroundColor:
                  isFirstLevel && node.key === treeData[0].key ? colors.lightPrimary : "transparent",
                borderBottom:
                  isFirstLevel && node.key === treeData[0].key
                    ? `1px solid ${colors.snowywhite}`
                    : "",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                  padding: "5px",
                  margin: "5px",
                  borderBottom:
                    isFirstLevel && node.key !== treeData[0].key && node.children && expanded.includes(node.key)
                      ? `1px solid ${colors.snowywhite}`
                      : "",
                  paddingLeft: node.children ? "5px" : "40px",
                  borderRadius:
                    isFirstLevel &&
                    node.key === treeData[0].key &&
                    node.children &&
                    expanded.includes(node.key)
                      ? "5px"
                      : "0px",
                  backgroundColor:
                    isFirstLevel && node.key === treeData[0].key ? colors.lightPrimary : "transparent",
                }}
              >
                <div
                  
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={checked.includes(node.key)}
                      onChange={() => handleCheck(node)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span onClick={() => handleExpand(node.key)} style={{ marginLeft: "5px", textAlign: "left" }}>{node.value}</span>
                </div>
                {node?.children && (
                  <button
                    onClick={() => handleExpand(node.key)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {expanded.includes(node.key) ? (
                      <img src={downward} style={{ width: "10px", height: "5px" }} />
                    ) : (
                      <img src={upward} style={{ width: "10px", height: "5px" }} />
                    )}
                  </button>
                )}
              </div>
            </div>
            {node.children && expanded.includes(node.key) && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
      {title && (
        <p
          style={{
            fontFamily: "OpenSans",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "25.2px",
            textAlign: "left",
            padding: 0,
            margin: 0,
            color: colors.black,
            paddingBottom: "10px",
          }}
        >
          {title}
        </p>
      )}
      <div style={{ width: "100%", border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }}>
        {renderTree(treeData, true)}
      </div>
      <style>
        {`
          .custom-checkbox {
            position: relative;
            display: inline-block;
            width: 18px;
            height: 18px;
          }

          .custom-checkbox input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: #ffffff;
            border-radius: 3px;
            border: 2px solid #3F4948;
          }

          .custom-checkbox input:checked ~ .checkmark {
            background-color: #006A67;
            border-color: #006A67;
          }

          .checkmark:after {
            content: "";
            position: absolute;
            display: none;
          }

          .custom-checkbox input:checked ~ .checkmark:after {
            display: block;
          }

          .checkmark:after {
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        `}
      </style>
      {/* <div style={{ marginTop: "10px" }}>
        <strong>Selected Solutions:</strong>
        <pre>{JSON.stringify(selectedSolutions, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default TreeView;


