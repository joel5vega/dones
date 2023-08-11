import React, { useState } from "react";
import Slider from "./SliderSimple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
function Preguntas(props) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    props.handleSaveProgress();
  };

  const totalPages = Math.ceil(props.answers?props.answers.length / itemsPerPage:1);

  return (
    <div className="preguntas">
      {props.answers !== undefined ? (
        <>
          <div className="preguntas">
            {props.answers
              .slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
              )
              .map((item) => (
                <Slider
                  key={item.id}
                  pregunta={item.pregunta}
                  id={item.id}
                  value={item.respuesta ? item.respuesta : 0}
                  onChange={props.onChange}
                />
              ))}
          </div>
          <div className="pagination">
           
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={pageNumber === currentPage ? "active" : ""}
              >
                {pageNumber + 1}
              </button>
            ))}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                className="next"
              ></button>
            )}
          </div>
          {currentPage === totalPages - 1 && (
            <>
            <button onClick={props.buscarDon} className="boton">
              <FontAwesomeIcon icon={faSearch} />
               Buscar mi don
            </button>
            {/* <button onClick={props.handleResetClick} className="boton">Reset</button> */}
            
            </>
          )}
        </>
      ) : (
        <div>no puedes ver preguntas</div>
      )}
    </div>
  );
}
export default Preguntas;
