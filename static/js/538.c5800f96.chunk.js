"use strict";(self.webpackChunkdones=self.webpackChunkdones||[]).push([[538],{9538:function(e,a,n){n.r(a),n.d(a,{default:function(){return q}});var s=n(1413),o=n(885),i=n(2791),r=[{id:1,pregunta:"Organizo ideas, recursos, tiempo y personas efectivamente."},{id:2,pregunta:"Estudio y me preparo para ense\xf1ar."},{id:3,pregunta:"Relaciono las verdades de Dios con situaciones espec\xedficas."},{id:4,pregunta:"Ayudo a otros a crecer en su fe."},{id:5,pregunta:"Comunico la verdad de la salvaci\xf3n efectivamente."},{id:6,pregunta:"Puedo tomar decisiones importantes."},{id:7,pregunta:"Soy sensible a las heridas de las personas."},{id:8,pregunta:"Experimento gozo al compartir mis posesiones con otros."},{id:9,pregunta:"Disfruto estudiar."},{id:10,pregunta:"Entrego el mensaje de juicio y advertencia de Dios"},{id:11,pregunta:"Percibo las motivaciones verdaderas de las personas o movimientos."},{id:12,pregunta:"Conf\xedo totalmente en Dios en situaciones dif\xedciles."},{id:13,pregunta:"Anhelo contribuir al establecimiento de nuevas iglesias."},{id:14,pregunta:"Me alegra ayudar a personas en necesidad."},{id:15,pregunta:"Disfruto recibir invitados en casa."},{id:16,pregunta:"Adapto mi direcci\xf3n seg\xfan la madurez de mi equipo."},{id:17,pregunta:"Delego y asigno trabajo significativo."},{id:18,pregunta:"Tengo habilidad y deseo de ense\xf1ar."},{id:19,pregunta:"Analizo situaciones correctamente."},{id:20,pregunta:"Pienso en c\xf3mo animar a otros en mi congregaci\xf3n"},{id:21,pregunta:"Entreno a cristianos a ser disc\xedpulos m\xe1s obedientes"},{id:22,pregunta:"Entiendo los sentimientos de aquellos que est\xe1n en angustia."},{id:23,pregunta:"Reconozco que Dios es due\xf1o de todo."},{id:24,pregunta:"Paso tiempo ahondando en los hechos."},{id:25,pregunta:"Tengo un mensaje de Dios que entregar a otros."},{id:26,pregunta:"Reconozco cuando una persona es genuina/honesta."},{id:27,pregunta:"Puedo motivar a otros para que alcancen su potencial."},{id:28,pregunta:"Me rindo a la voluntad de Dios en vez de cuestionar y dudar."},{id:29,pregunta:"Me gustar\xeda llevar el evangelio a gente en otras tierras"},{id:30,pregunta:"Disfruto haciendo cosas peque\xf1as para ayudar a la gente."},{id:31,pregunta:"Establezco pasos a seguir positivos y precisos."},{id:32,pregunta:"Hago que los extra\xf1os se sientan c\xf3modos en mi hogar o iglesia3"},{id:33,pregunta:"Explico las escrituras de manera clara."},{id:34,pregunta:"Puedo identificar a aqu\xe9llos que necesitan \xe1nimo."},{id:35,pregunta:"Doy direcci\xf3n espiritual a otros"},{id:36,pregunta:"Hago de todo para que otros vengan a Cristo."},{id:37,pregunta:"Reconozco las se\xf1ales de estr\xe9s y angustia en otros"},{id:38,pregunta:"Soy un dador generoso."},{id:39,pregunta:"Descubro nuevas verdades."},{id:40,pregunta:"Tengo visi\xf3n espiritual de la Escritura que me empuja a hablar."},{id:41,pregunta:"Siento cuando una persona est\xe1 actuando bajo el liderazgo de Dios."},{id:42,pregunta:"Conf\xedo en Dios incluso cuando las cosas se ven oscuras"},{id:44,pregunta:"Deseo llevar el evangelio a donde jam\xe1s ha sido escuchado."},{id:45,pregunta:"Disfruto acercarme a nuevas personas en mi iglesia o comunidad."},{id:46,pregunta:"Soy sensible a las necesidades f\xedsicas y pr\xe1cticas."},{id:48,pregunta:"Frecuentemente me consultan hermanos que tienen dudas en decisiones."},{id:49,pregunta:"Ayudo a personas que necesitan consuelo, \xe1nimo y consejer\xeda."},{id:51,pregunta:"Me gusta hablar de Jes\xfas con aqu\xe9llos que no lo conocen."}],t=n(1373),d=n(4554),u=n(7240),c=n(184),l=[{value:0,label:"No"},{value:1},{value:3},{value:4,label:"Si"}];function p(e){return"".concat(e)}function g(e){return(0,c.jsx)(d.Z,{sx:{height:55,maxWidth:100,color:"var(--activo)"},children:(0,c.jsx)(u.ZP,{"aria-label":"Always visible",defaultValue:0,getAriaValueText:p,step:1.25,marks:l,value:e.valor,onChange:e.onChange,max:4,color:"primary"})})}var m=function(e){return(0,c.jsxs)("div",{className:"pregunta",children:[(0,c.jsx)("div",{className:"pregunta-text",children:e.pregunta}),(0,c.jsx)("div",{className:"respuesta",children:(0,c.jsx)(g,{value:e.valor,onChange:function(a){return e.onChange(e.id,a)}})})]})},v=n(6152),f=n(1257),h=n(3504),x=n(3226),b=n(1097);v.kL.register(v.uw,v.f$,v.ZL,v.Dx,v.u,v.De);var j={indexAxis:"y",elements:{bar:{borderWidth:1}},responsive:!0,plugins:{datalabels:{display:!0},legend:{display:!1},title:{display:!0,text:"Mis dones",fontSize:18}}},y=i.forwardRef((function(e,a){return(0,c.jsxs)("div",{ref:a,className:"results",children:[(0,c.jsx)(f.$Q,{options:e.options,data:e.data}),(0,c.jsx)("div",{className:"dones",children:e.dones.slice(0,4).map((function(e,a){return(0,c.jsx)(x.Z,{data:e},a)}))}),"Fuente: joelvega.me/dones"]})}));var D=function(e){var a=e.dones,n=e.dones.map((function(e){return e.name})).slice(0,4),s=(0,i.useRef)(),o={labels:n,datasets:[{label:"Dones",data:a.map((function(e){return e.score})).slice(0,4),backgroundColor:"#3952b2"}]};return(0,c.jsx)("div",{className:"resultados",children:e.show&&(0,c.jsxs)(i.Fragment,{children:[(0,c.jsx)(y,{ref:s,options:j,data:o,dones:a}),(0,c.jsx)("div",{className:"boton",onClick:function(){return(0,b.exportComponentAsJPEG)(s,{fileName:"misdones"})},children:"Descargar resultados"}),(0,c.jsx)(h.rU,{style:{margin:"2rem",color:"var(--fondo)",background:"var(--activo)",padding:"1rem",minHeight:"1rem ",borderRadius:"1rem"},to:"/lista",onClick:function(){return(0,b.exportComponentAsJPEG)(s,{fileName:"misdones"})},children:"Ver listado de todos los dones"})]})})},C=n(6641);var q=function(){var e=(0,i.useState)(r),a=(0,o.Z)(e,2),n=a[0],d=a[1],u=(0,i.useState)(t.Z),l=(0,o.Z)(u,2),p=l[0],g=l[1],v=(0,i.useState)(!1),f=(0,o.Z)(v,2),h=f[0],x=f[1],b=(0,i.useState)(0),j=(0,o.Z)(b,2),y=(j[0],j[1],function(e,a){var o=a.target.value;console.log(e,o);var i;i=n.map((function(a){return a.id===e?(0,s.Z)((0,s.Z)({},a),{},{respuesta:o}):a})),d(i)});return(0,c.jsxs)("div",{children:[(0,c.jsx)(C.Z,{title:"Test Dones",result:h,action:function(){x(!h)}}),h?(0,c.jsx)(D,{show:h,dones:p.sort((function(e,a){return a.score-e.score}))}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("div",{className:"preguntas",children:n.map((function(e){return(0,c.jsx)(m,{id:e.id,pregunta:e.pregunta,valor:e.respuesta||0,onChange:y},e.id)}))})," ",(0,c.jsx)("div",{className:"boton",onClick:function(){var e=p;t.Z.map((function(a){var o=a.score;n.map((function(e){a.valores.map((function(a){e.id===a&&e.respuesta&&(o+=e.respuesta)}))})),console.log(a.name,o),e=e.map((function(e){return e.id==a.id?(0,s.Z)((0,s.Z)({},e),{},{score:o}):e})),g(e)})),x(!h)},children:"Buscar mi Don"})]})]})}}}]);
//# sourceMappingURL=538.c5800f96.chunk.js.map