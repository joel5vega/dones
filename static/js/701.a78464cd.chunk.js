"use strict";(self.webpackChunkdones=self.webpackChunkdones||[]).push([[701],{9701:function(e,s,n){n.r(s),n.d(s,{default:function(){return x}});var r=n(1413),a=n(885),o=n(2791),t=n(8033),i=n(1373),d=n(6152),u=n(1257),l=n(3504),c=n(3226),f=n(1097),m=n(184);d.kL.register(d.uw,d.f$,d.ZL,d.Dx,d.u,d.De);var p={indexAxis:"y",elements:{bar:{borderWidth:1}},responsive:!0,plugins:{datalabels:{display:!0},legend:{display:!1},title:{display:!0,text:"Mis dones",fontSize:18}}},h=o.forwardRef((function(e,s){return(0,m.jsxs)("div",{ref:s,className:"results",children:[(0,m.jsx)(u.$Q,{options:e.options,data:e.data}),(0,m.jsx)("div",{className:"dones",children:e.dones.slice(0,4).map((function(e,s){return(0,m.jsx)(c.Z,{data:e},s)}))}),"Fuente: joel5vega.github.io/dones"]})}));var v=function(e){var s=e.dones,n=e.dones.map((function(e){return e.name})).slice(0,4),r=(0,o.useRef)(),a={labels:n,datasets:[{label:"Dones",data:s.map((function(e){return e.score})).slice(0,4),backgroundColor:"#3952b2"}]};return(0,m.jsx)("div",{className:"resultados",children:e.show&&(0,m.jsxs)(o.Fragment,{children:[(0,m.jsx)(h,{ref:r,options:p,data:a,dones:s}),(0,m.jsx)("div",{className:"boton",onClick:function(){return(0,f.exportComponentAsJPEG)(r,{fileName:"misdones"})},children:"Descargar resultados"}),(0,m.jsx)(l.rU,{style:{margin:"2rem",color:"var(--fondo)",background:"var(--activo)",padding:"1rem",minHeight:"1rem ",borderRadius:"1rem"},to:"/lista",onClick:function(){return(0,f.exportComponentAsJPEG)(r,{fileName:"misdones"})},children:"Ver listado de todos los dones"})]})})},g=(0,o.lazy)((function(){return Promise.all([n.e(632),n.e(395)]).then(n.bind(n,2395))}));var x=function(e){var s=(0,o.useState)({}),n=(0,a.Z)(s,2),d=(n[0],n[1],(0,o.useState)(e.user?e.answers:t.Z)),u=(0,a.Z)(d,2),l=u[0],c=u[1],f=(0,o.useState)(i.Z),p=(0,a.Z)(f,2),h=p[0],x=p[1],b=(0,o.useState)(!1),Z=(0,a.Z)(b,2),j=Z[0],w=Z[1],S=(0,o.useState)(0),k=(0,a.Z)(S,2),C=(k[0],k[1],(0,o.useState)(!1)),P=(0,a.Z)(C,2),y=(P[0],P[1],e.user&&e.user.uid,function(s,n){var a;a=l.map((function(e){return e.id===s?(0,r.Z)((0,r.Z)({},e),{},{respuesta:n}):e})),c(a),e.setAnswers(a)});return(0,m.jsx)("div",{children:j?(0,m.jsx)(v,{show:j,dones:h.sort((function(e,s){return s.score-e.score}))}):(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(g,{answers:e.answers,onChange:y,handleSaveProgress:e.handleSaveProgress,buscarDon:function(){var s=h;i.Z.map((function(e){var n=e.score;l.map((function(s){e.valores.map((function(e){s.id===e&&s.respuesta&&(n+=s.respuesta)}))})),s=s.map((function(s){return s.id==e.id?(0,r.Z)((0,r.Z)({},s),{},{score:n}):s})),x(s)})),w(!j),e.handleSaveProgress()},handleResetClick:function(){e.answers.forEach((function(e){y(e.id,0)})),console.log(e.answers),e.handleSaveProgress()}})})})}}}]);
//# sourceMappingURL=701.a78464cd.chunk.js.map