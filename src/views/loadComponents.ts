'use strict'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  '@/components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

export default function(Vue) {
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)

    const componentName = upperFirst(
    camelCase(fileName
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')
    )
  )


  Vue.component(componentName, componentConfig.default || componentConfig)
})
}
