type Elem = NodeListOf<Element> | HTMLElement | JQuery<HTMLElement> | Element
declare let M
export const modalInitGetInstance = (modalElem: Elem) => {
	return M.Modal.getInstance(modalElem)
}
export const modalInit = (modalElem: Elem, options?: object) => {
	return M.Modal.init(modalElem, options)
}
export const dropdownInit = (modalElem: Elem, options?: object) => {
	return M.Dropdown.init(modalElem, options)
}
export const dropdownInitGetInstance = (elem: Elem | HTMLInputElement) => {
	return M.Dropdown.getInstance(elem)
}
export const collapsibleInit = (modalElem: Elem, options?: object) => {
	return M.Collapsible.init(modalElem, options)
}
export const collapsibleInitGetInstance = (modalElem: Elem) => {
	return M.Collapsible.getInstance(modalElem)
}
export const toast = (options?: object) => {
	return M.toast(options)
}
export const formSelectInit = (modalElem: Elem, options?: object) => {
	return M.FormSelect.init(modalElem, options)
}
export const formSelectGetInstance = (elem: Elem | HTMLInputElement) => {
	return M.FormSelect.getInstance(elem)
}
export const autoCompleteGetInstance = (elem: Elem | HTMLInputElement) => {
	return M.Autocomplete.getInstance(elem)
}
export const autoCompleteInit = (elem: Elem | HTMLInputElement, options?: object) => {
	return M.Autocomplete.init(elem, options)
}
export const characterCounterInit = (elem: Elem | HTMLInputElement) => {
	return M.CharacterCounter.init(elem)
}
export const chipInit = (elem: Elem | HTMLInputElement, options?: object) => {
	return M.Chips.init(elem, options)
}
export const chipInitGetInstance = (elem: Elem | HTMLInputElement) => {
	return M.Chips.getInstance(elem)
}
