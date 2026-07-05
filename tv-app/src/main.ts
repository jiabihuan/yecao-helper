import { createESRouter, Router } from '@extscreen/es3-router'
import routes from './routes'
import application from './App.vue'
import { ESApp } from '@extscreen/es3-vue'
import { createESApp } from '@extscreen/es3-core'
import { ESComponent } from '@extscreen/es3-component'

import '@quicktvui/quicktvui3/dist/index.css'
import { QuickTVUI } from '@quicktvui/quicktvui3'

const routerOptions = {
  main: 'home',
  limit: 5,
  routes: routes
}
const router: Router = createESRouter(routerOptions)
const app: ESApp = createESApp(application, router)

app.use(ESComponent)
app.use(QuickTVUI)
