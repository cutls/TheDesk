//モーダル・ドロップダウンの各種設定
$(document).ready(function () {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  const modals = document.querySelectorAll('.modal')
  M.Modal.init(modals, {
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false
  })
  const dropdown = document.querySelectorAll('.modal')
  M.Dropdown.init(dropdown, {
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  })
  M.Collapsible.init(document.querySelectorAll('.collapsible'));
  const videoModal = document.querySelectorAll('#videomodal')
  M.Modal.init(videoModal, {
    onCloseEnd: stopVideo
  })
})