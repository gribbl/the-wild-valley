/// <reference path="../adonisrc.ts" />
/// <reference path="../config/inertia.ts" />
/// <reference path="../config/auth.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/vue3'
import type { DefineComponent } from 'vue'
import { createApp, h } from 'vue'
import './css/app.css'
import AppLayout from './layouts/AppLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'

createInertiaApp({
  title: (title) => `${title} - The Wild Valley`,
  resolve: async (name) => {
    const resolvedPage = await resolvePageComponent(
      `./pages/${name}.vue`,
      import.meta.glob<DefineComponent>('./pages/**/*.vue')
    )
    resolvedPage.default.layout = [
      AppLayout,
      name.startsWith('auth') ? AuthLayout : DashboardLayout,
    ]
    return resolvedPage
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})
