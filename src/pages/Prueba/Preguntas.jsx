import Single from "./Single";
import PreguntasData from "../../data/PreguntasData";
import LoginPage from "../../components/auth/GoogleSignInButton";
function Preguntas(props) {
  return (
    <div className="preguntas">
      {props.answers !== undefined ? (
        <div className="preguntas">
          {props.answers.map((item) => (
            <Single
              key={item.id}
              id={item.id}
              pregunta={item.pregunta}
              valor={item.respuesta ? item.respuesta : 0}
              onChange={props.onChange}
            />
          ))}
        </div>
      ) : (
        <div>
          {/* <LoginPage /> */}
          no puedes ver preguntas
        </div>
      )}
    </div>
  );
}
export default Preguntas;
