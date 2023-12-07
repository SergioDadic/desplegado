import React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import colores from "../../colors/colores";

function Subheader({ texto }) {
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
      <ListSubheader style={{ background:"none"}}>
        {texto}
      </ListSubheader>
      <Divider style={{marginTop:"-10px", marginBottom:"8px", width:"100%"}} light />
    </div>
  );
}

export default Subheader;