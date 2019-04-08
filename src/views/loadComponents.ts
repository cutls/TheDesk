'use strict'

import Vue from 'vue';
import { upperFirst } from 'lodash'
import { camelCase } from 'lodash'

const requireComponent = require.context(
  '@/components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

export default function() {
  requireComponent.keys().forEach((fileName: string) => {
      const componentConfig = requireComponent(fileName)
      const componentName = upperFirst(
          camelCase(
              fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
          )
      )
      Vue.component(componentName, componentConfig.default || componentConfig)
  })
}
