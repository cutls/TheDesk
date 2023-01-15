import { stopVideo } from "../ui/img";
import { collapsibleInit, dropdownInit, modalInit } from "./declareM";

//モーダル・ドロップダウンの各種設定

$(document).ready(function () {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  const modalElem = document.querySelectorAll('.modal')
  modalInit(modalElem, {
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false
  })
  const ddElem = document.querySelectorAll('.dropdown-trigger');
  dropdownInit(ddElem, {
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  })
  const colElem = document.querySelectorAll('.collapsible');
  collapsibleInit(colElem)
  const vModalElem = document.querySelectorAll('#videomodal')
  modalInit(vModalElem, {
    onCloseEnd: stopVideo
  })
})