"use strict";(self.webpackChunkdones=self.webpackChunkdones||[]).push([[52],{5052:function(e,n,s){s.r(n),s.d(n,{default:function(){return u}});var a=s(2982),c=s(885),i=s(2791),r=s(9806),l=s(1632),o=s(184),t=function(e){var n=e.id,s=e.value,a=e.onChange,c=e.pregunta,i=[{icon:l.UwO,label:"No",value:0},{icon:l.ctA,label:"Maybe",value:1},{icon:l.xC,label:"Surely",value:2},{icon:l.Lew,label:"Definitely",value:3},{icon:l.Lew,label:"Definitely",value:4}];return(0,o.jsxs)("div",{className:"slider-container",children:[(0,o.jsx)("label",{htmlFor:n,children:c}),(0,o.jsx)("div",{className:"slider-value",children:(0,o.jsx)(r.G,{icon:i[s].icon,color:"#FBAF00"})}),(0,o.jsxs)("div",{className:"slider-input-container",children:[(0,o.jsx)("label",{children:"Poco"}),(0,o.jsx)("input",{id:n,type:"range",min:"0",max:"3",value:s,onChange:function(e){return a(n,Number(e.target.value))}}),(0,o.jsx)("label",{children:"Mucho"})]})]})};var u=function(e){var n=(0,i.useState)(0),s=(0,c.Z)(n,2),u=s[0],d=s[1],x=function(n){d(n),e.handleSaveProgress()},h=Math.ceil(e.answers?e.answers.length/10:1);return(0,o.jsxs)("section",{children:[0==u&&(0,o.jsxs)("div",{className:"instrucciones",children:[(0,o.jsxs)("p",{className:"instruccion",children:["Responde con sinceridad, si estas de acuerdo con cada declaraci\xf3n."," "]}),(0,o.jsxs)("p",{className:"instruccion",children:[(0,o.jsx)(r.G,{icon:l.UwO}),": Poco, muy raras veces."]}),(0,o.jsxs)("p",{className:"instruccion",children:[(0,o.jsx)(r.G,{icon:l.ctA}),": A veces, me falta mejorar"]}),(0,o.jsxs)("p",{className:"instruccion",children:[(0,o.jsx)(r.G,{icon:l.xC}),": Generalmente, me siento c\xf3modo con esto."]}),(0,o.jsxs)("p",{className:"instruccion",children:[(0,o.jsx)(r.G,{icon:l.Lew}),": Siempre, es algo que me encanta."]})]}),void 0!==e.answers?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{className:"preguntas",children:e.answers.slice(10*u,10*(u+1)).map((function(n){return(0,o.jsx)(t,{pregunta:n.pregunta,id:n.id,value:n.respuesta?n.respuesta:0,onChange:e.onChange},n.id)}))}),(0,o.jsxs)("div",{className:"action-bar",children:[(0,o.jsxs)("div",{className:"pagination",children:[(0,a.Z)(Array(h).keys()).map((function(e){return(0,o.jsx)("button",{onClick:function(){return x(e)},className:e===u?"active":"",children:e+1},e)})),u<h-1&&(0,o.jsx)("button",{onClick:function(){return x(u+1)},className:"next"})]}),u===h-1&&(0,o.jsx)(o.Fragment,{children:(0,o.jsx)("button",{onClick:e.buscarDon,className:"boton",children:(0,o.jsxs)("div",{className:"boton-con-logo",children:[(0,o.jsx)(r.G,{className:"boton-icon",icon:l.wn1}),"Buscar mi don"]})})})]})]}):(0,o.jsx)("section",{children:"no puedes ver preguntas"})]})}}}]);
//# sourceMappingURL=52.897ec409.chunk.js.map