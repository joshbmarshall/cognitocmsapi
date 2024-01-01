import { defineCustomElement as VueDefineCustomElement, createApp, getCurrentInstance, h } from 'vue'

const getNearestElementParent = (el) => {
  while (el?.nodeType !== 1 /* ELEMENT */) {
    el = el.parentElement
  }
  return el
}

export const defineCustomElement = (component: any, { plugins = [] }) =>
  VueDefineCustomElement({
    render: () => h(component),
    props: component.props,
    setup(props) {
      const app = createApp({})

      // install plugins
      plugins.forEach(app.use)

      const inst = getCurrentInstance()
      if (inst) {
        Object.assign(inst.appContext, app._context)
        Object.assign(inst.provides, app._context.provides)
      }
      return () => h(component, props)
    },
    styles: component.styles,
  })
