'use strict'

import Vue from 'vue'
import { upperFirst, camelCase } from 'lodash'

const requireComponent = require.context('./globals', false, /Base[A-Z]\w+\.(vue|js)$/)

requireComponent.keys().forEach((fileName: string) => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )
  Vue.component(componentName, componentConfig.default || componentConfig)
})