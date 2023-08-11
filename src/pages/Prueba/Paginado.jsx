import Slider from "./SliderSimple";
function Preguntas(props) {
  return (
    <div className="preguntas">
      {props.answers !== undefined ? (
        <div className="preguntas">
          {props.answers.map((item) => (
            <Slider  key={item.id} pregunta ={item.pregunta} id={item.id} value={item.respuesta ? item.respuesta : 0} onChange={props.onChange} />
          ))}
        </div>
      ) : (
        <div>
          no puedes ver preguntas
        </div>
      )}
    </div>
  );
}
export default Preguntas;

