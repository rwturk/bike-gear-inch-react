import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

// Some calculation functions
function mm2inch(mm) {
  return +(+mm * 0.03937).toFixed(5);
}

function inch2mm(i) {
  return +(+i * 25.4).toFixed(5);
}

function calcDiam(w, rd) {
  return +w * 2 + +rd;
}

function calcGI(d, c, s) {
  return mm2inch(+d) * (+c / +s);
}

function calcMOD(d, c, s) {
  return ((Math.PI * +d) / 1000) * (+c / +s);
}

function calcKPH(mod, c) {
  return (+mod * +c * 60) / 1000;
}

function calcMPH(gi, c) {
  return +gi * +c * (Math.PI / 1056);
}

function Row({c,s,mod,gi,kph,mph,key}) {
  return (
    <tr key={key}>
      <td>{c}/{s}</td>
      <td>{mod}</td>
      <td>{gi}</td>
      <td>{kph}</td>
      <td>{mph}</td>
    </tr>
  );
}

function GearTable(props) {
  const gearCombos = [];
  const ct = props.ct.split(",");
  const st = props.st.split(",");
  let key = 0

  for(let i = 0; i < ct.length; i++) {
    for(let j = 0; j < st.length; j++) {
      let mod = calcMOD(props.diam, ct[i], st[j]);
      let gi = calcGI(props.diam, ct[i], st[j])
      let kph = calcKPH(mod, props.cad);
      let mph = calcMPH(gi,props.cad);
      gearCombos.push({
        "ct": ct[i],
        "st": st[j],
        "mod": mod.toFixed(2),
        "gi": gi.toFixed(2),
        "kph": kph.toFixed(1),
        "mph": mph.toFixed(1),
        "k": key
      });
      key++;
    }
  }
  console.log(gearCombos);

  return (
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Gear</th>
          <th>MoD</th>
          <th>Gear Inches</th>
          <th>KPH</th>
          <th>MPH</th>
        </tr>
      </thead>
      <tbody>
        {gearCombos.map(g => <Row c={g.ct} s={g.st} mod={g.mod} gi={g.gi} kph={g.kph} mph={g.mph} key={g.k} />)}
      </tbody>
    </table>
  );
}

function App() {
  const wheelMap = [
    { name: "700C", iso: 622, unit: "mm" },
    { name: "650C", iso: 571, unit: "mm" },
    { name: "650B", iso: 584, unit: "mm" },
    { name: "16in", iso: 305, unit: "in" },
    { name: "20in", iso: 406, unit: "in" },
    { name: "24in", iso: 507, unit: "in" },
    { name: "26in", iso: 559, unit: "in" },
    { name: "27.5in", iso: 584, unit: "in" },
    { name: "29in", iso: 622, unit: "in" }
  ];
  const [unit, setUnit] = useState(wheelMap[0].unit);
  const [iso, setIso] = useState(wheelMap[0].iso);
  const [tWidth, setTWidth] = useState(45);
  const [ct, setCt] = useState("36");
  const [st, setSt] = useState("10,42");
  const [cad, setCad] = useState(60);

  return (
    <>
    <div class="col-sm-4">
      <label>Wheel Size: </label>
      <select class="form-select" onChange={(ev) => {
        setUnit(ev.target.value.split("-")[1]);
        setIso(ev.target.value.split("-")[0]);
      }}>
        {wheelMap.map(wheel => <option value={wheel.iso.toString() + "-" + wheel.unit} key={wheel.iso.toString() + "-" + wheel.unit}>{wheel.name}</option>)}
      </select>
      <br />
      <label>Tire Width ({unit}): </label>
      <input type="number" value={tWidth} class="form-control" onChange={(ev) => setTWidth(ev.target.value)} />
      <br />
      <label>Chainring Teeth (Comma Separated): </label>
      <input type="text" value={ct} class="form-control" onChange={(ev) => setCt(ev.target.value)} />
      <br />
      <label>Sprocket Teeth (Comma Separated): </label>
      <input type="text" value={st} class="form-control" onChange={(ev) => setSt(ev.target.value)} />
      <br />
      <label>Cadence: </label>
      <input type="number" value={cad} class="form-control" onChange={(ev) => setCad(ev.target.value)} />
    </div>
    <div class="col-sm-6">
      <GearTable diam={calcDiam((unit === "inch") ? inch2mm(tWidth) : tWidth, iso)} ct={ct} st={st} cad={cad} />
    </div>
    </>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);