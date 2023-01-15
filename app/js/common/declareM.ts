type Elem = NodeListOf<Element> | HTMLElement | JQuery<HTMLElement> | Element
declare var M
export const modalInitGetInstance = (modalElem: Elem) => {
    return M.Modal.getInstance(modalElem)
}
export const modalInit = (modalElem: Elem, options?: Object) => {
    return M.Modal.init(modalElem, options)
}
export const dropdownInit = (modalElem: Elem, options?: Object) => {
    return M.Dropdown.init(modalElem, options)
}
export const dropdownInitGetInstance = (elem: Elem | HTMLInputElement) => {
    return M.Dropdown.getInstance(elem)
}
export const collapsibleInit = (modalElem: Elem, options?: Object) => {
    return M.Collapsible.init(modalElem, options)
}
export const collapsibleInitGetInstance = (modalElem: Elem) => {
    return M.Collapsible.getInstance(modalElem)
}
export const toast = (options?: Object) => {
    return M.toast(options)
}
export const formSelectInit = (modalElem: Elem, options?: Object) => {
    return M.FormSelect.init(modalElem, options)
}
export const autoCompleteGetInstance = (elem: Elem | HTMLInputElement) => {
    return M.Autocomplete.getInstance(elem)
}
export const autoCompleteInit= (elem: Elem | HTMLInputElement, options?: Object) => {
    return M.Autocomplete.init(elem, options)
}
export const characterCounterInit= (elem: Elem | HTMLInputElement) => {
    return M.CharacterCounter.init(elem)
}
export const chipInit= (elem: Elem | HTMLInputElement, options?: Object) => {
    return M.Chips.init(elem, options)
}
export const chipInitGetInstance= (elem: Elem | HTMLInputElement) => {
    return M.Chips.getInstance(elem)
}