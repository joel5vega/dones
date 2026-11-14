import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faBookOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import iconos from "../../data/iconos";
import referencias from "../../data/referencias";

function Don({ data }) {
  const { id, name, definicion, texto } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [showVerse, setShowVerse] = useState(false);

  const libro = texto ? texto.split(" ")[0].replace("1", "").trim() : "";
  const fullReference = referencias.find((ref) => ref.title.includes(libro));

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) setShowVerse(false);
  };

  return (
  <div style={{ color: "red", fontSize: "50px" }}>
    ¡ESTO ES UNA PRUEBA!
  </div>
);
}

export default Don;