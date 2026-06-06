import { useState } from "react";
const EXT_MAP = {pdf:"PDF",pptx:"PPT",ppt:"PPT",docx:"DOC",doc:"DOC",xlsx:"XLS",xls:"XLS",html:"HTM",htm:"HTM",txt:"TXT",md:"MD"};
function getExt(f){return EXT_MAP[f.split(".").pop().toLowerCase()]||"FILE";}
export default function History({ navigate, history }) {
  const [selected,setSelected]=useState(null);const [copied,setCopied]=useState(false);
  const handleCopy=()=>{navigator.clipboard.writeText(selected.markdown);setCopied(true);setTimeout(()=>setCopied(false),1800);};
  const handleDownload=()=>{const b=new Blob([selected.markdown],{type:"text/markdown"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=selected.filename.replace(/\.[^.]+$/,"")+".md";a.click();URL.revokeObjectURL(u);};
  if(selected){return(
    <div className="history-page"><div className="history-detail">
      <div className="history-detail-header">
        <button className="back-btn" onClick={()=>{setSelected(null);setCopied(false);}}>← Back</button>
        <span className="detail-filename">{selected.filename}</span>
        <div style={{marginLeft:"auto",display:"flex",gap:"8px"}}>
          <button className={`action-btn ${copied?"copied":""}`} onClick={handleCopy}>{copied?"✓ copied":"copy"}</button>
          <button className="action-btn" onClick={handleDownload}>↓ .md</button>
        </div>
      </div>
      <div className="history-detail-body"><textarea className="detail-textarea" readOnly value={selected.markdown}/></div>
    </div></div>
  );}
  return(
    <div className="history-page">
      <div className="history-header"><h1>History</h1><p>{history.length} conversion{history.length!==1?"s":""} this session</p></div>
      <div className="history-body">
        {history.length===0?(
          <div className="history-empty"><div className="history-empty-title">No conversions yet</div><p className="history-empty-sub">Go convert a file and it'll appear here.</p><button className="btn-primary" onClick={()=>navigate("convert")}>Convert a file →</button></div>
        ):(
          <div className="history-list">
            {history.map((item,i)=>(
              <div className="history-item" key={i}>
                <div className="history-ext">{getExt(item.filename)}</div>
                <div><div className="history-name">{item.filename}</div><div className="history-meta">{item.date}</div></div>
                <div className="history-chars">{item.chars.toLocaleString()} chars</div>
                <button className="history-view-btn" onClick={()=>setSelected(item)}>View →</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
