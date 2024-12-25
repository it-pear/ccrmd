import { buildMode } from "src/data/buildMode";

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      requireLogin: false
    },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '/login',
        component: () => import('pages/Auth/Login.vue'),
        meta: {
          requireLogin: false,
          title: 'CRMD — Вход в систему'
        }
      },
      {
        path: '/register',
        component: () => import('pages/Auth/Register.vue'),
        meta: {
          requireLogin: false,
          title: 'CRMD — Регистрация'
        }
      },
      {
        path: '/loading',
        component: () => import('pages/Auth/Loading.vue')
      },
      {
        path: '/role',
        component: () => import('pages/Auth/Role.vue'),
        meta: {
          requireLogin: false,
          title: 'CRMD — Выберите роль'
        }
      },
      {
        path: '/reset',
        component: () => import('pages/Auth/Reset.vue'),
        meta: {
          requireLogin: false,
          title: 'CRMD — Восстановление пароля'
        }
      },
      {
        path: '/pass',
        component: () => import('pages/Auth/Pass.vue')
      },
      {
        path: '/setemail',
        component: () => import('pages/Auth/SetEmail.vue')
      },
      {
        path: '/resetpass',
        component: () => import('pages/Auth/resetPass.vue'),
        meta: {
          requireLogin: false,
          title: 'CRMD — Восстановление пароля'
        }
      },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: buildMode === 'dev' ? [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor']
        }
      },
      {
        path: '/finance',
        component: () => import('pages/Finance/index.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: 'CRMD — Финансы'
        }
      },
      {
        path: '/projects',
        component: () => import('src/pages/Project/List.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: 'CRMD — Проекты'
        }
      },
      {
        path: '/projects/:id',
        component: () => import('src/pages/Project/Id.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor']
        }
      },
      {
        path: '/contractor',
        component: () => import('src/pages/Contractor/Index.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: 'CRMD — Подрядчики',
        }
      },
      {
        path: '/contractor/:id',
        component: () => import('src/pages/Contractor/Id.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: false,
        }
      },
      {
        path: '/contractor/profile',
        component: () => import('src/pages/Contractor/Profile.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: 'CRMD — Профиль'
        }
      },
      {
        path: '/designer',
        component: () => import('src/pages/Designer/Index.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: 'CRMD — Дизайнеры'
        }
      },
      {
        path: '/designer/:id',
        component: () => import('src/pages/Designer/Id.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: false
        }
      },
      {
        path: '/designer/profile',
        component: () => import('src/pages/Designer/Profile.vue'),
        meta: {
          requireLogin: true,
          role: 'designer',
          title: 'CRMD — Профиль'
        }
      },
      {
        path: '/clients',
        component: () => import('src/pages/Сlients/Index.vue'),
        meta: {
          requireLogin: true,
          role: 'designer',
          title: 'CRMD — Заказчики'
        }
      },
      {
        path: '/clients/:id',
        component: () => import('src/pages/Сlients/Id.vue'),
        meta: {
          requireLogin: true,
          role: 'designer'
        }
      },
      {
        path: '/estimates',
        component: () => import('src/pages/Estimates/ListAll.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: 'CRMD — Сметы'
        }
      },
      {
        path: '/estimates/:id',
        component: () => import('src/pages/Estimates/Id.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor']
        }
      },
      // TODO: Пока не понятно, нужен ли будет этот экран
      {
        path: '/estimates/export/:id',
        component: () => import('src/pages/Estimates/ExportEstimate.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor']
        }
      },
      {
        path: '/estimates/project/:id',
        component: () => import('src/pages/Estimates/Index.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: false
        }
      },
      {
        path: '/notifications',
        component: () => import('src/pages/Notifications/Index.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: 'CRMD — Уведомления'
        }
      },
      {
        path: '/album/:id',
        component: () => import('src/pages/Album/Id.vue'),
        name: 'album',
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: false,
        }
      },
      {
        path: '/personal',
        component: () => import('src/pages/Personal/Index.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor'],
          title: 'CRMD — Аккаунт'
        }
      }
    ] : [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          requireLogin: true,
          role: ['designer', 'contractor']
        }
      },
      {
        path: '/contractor',
        component: () => import('src/pages/Contractor/Index.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: 'CRMD — Подрядчики',
        }
      },
      {
        path: '/contractor/:id',
        component: () => import('src/pages/Contractor/Id.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: false,
        }
      },
      {
        path: '/contractor/profile',
        component: () => import('src/pages/Contractor/Profile.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: 'CRMD — Профиль'
        }
      },
      {
        path: '/designer',
        component: () => import('src/pages/Designer/Index.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: 'CRMD — Дизайнеры'
        }
      },
      {
        path: '/designer/:id',
        component: () => import('src/pages/Designer/Id.vue'),
        meta: {
          requireLogin: true,
          role: 'contractor',
          title: false
        }
      },
      {
        path: '/designer/profile',
        component: () => import('src/pages/Designer/Profile.vue'),
        meta: {
          requireLogin: true,
          role: 'designer',
          title: 'CRMD — Профиль'
        }
      },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]



export default routes
