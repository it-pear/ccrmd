import { buildMode } from "src/data/buildMode";

export function getMe(state) {
  return state.me
}

export function getUser() {
  return JSON.parse(localStorage.getItem('userInfo'))
}

export function getLinks(state) {

  let userRole = getUser().role
  if (userRole === 'contractor') {
    return buildMode === 'dev' ? [
      {
        title: 'Профиль',
        link: '/contractor/profile',
        prefix: null
      },
      {
        title: 'Проекты',
        link: '/projects',
        prefix: null
      },
      {
        title: 'Сметы',
        link: '/estimates',
        prefix: null
      },
      {
        title: 'Финансы',
        link: '/finance',
        prefix: '?add=true'
      },
      {
        title: 'Заказчики',
        link: '/clients',
        prefix: '?add=true'
      },
      {
        title: 'Дизайнеры',
        link: '/designer',
        prefix: '?add=true'
      },
      // #TODO: Вернуть при необходимости
      // {
      //   title: 'Документы',
      //   link: '/documents',
      //   prefix: '?add=true'
      // },
    ] : [
      {
        title: 'Профиль',
        link: '/contractor/profile',
        prefix: null
      },
      {
        title: 'Дизайнеры',
        link: '/designer',
        prefix: null
      },
    ]
  }
  if (userRole === 'designer') {
    return buildMode === 'dev' ? [
      {
        title: 'Профиль',
        link: '/designer/profile',
        prefix: null
      },
      {
        title: 'Проекты',
        link: '/projects',
        prefix: '?add=true'
      },
      {
        title: 'Сметы',
        link: '/estimates',
        prefix: null
      },
      {
        title: 'Финансы',
        link: '/finance',
        prefix: '?add=true'
      },
      {
        title: 'Заказчики',
        link: '/clients',
        prefix: '?add=true'
      },
      {
        title: 'Подрядчики',
        link: '/contractor',
        prefix: '?add=true'
      },
      // #TODO: Вернуть при необходимости
      // {
      //   title: 'Документы',
      //   link: '/documents',
      //   prefix: '?add=true'
      // },
    ] : [
      {
        title: 'Профиль',
        link: '/designer/profile',
        prefix: null
      },
      {
        title: 'Подрядчики',
        link: '/contractor',
        prefix: null
      },
    ]
  }

}

export function getToken(state) {
  return state.token
}

export function isAuthenticated(state) {
  return state.isAuthenticated
}
