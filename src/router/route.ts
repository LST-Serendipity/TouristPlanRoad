export const ConstRoute=[
  {
    path:'/',
    name:'layout',
    component:()=>import('../layout/index.vue'),
    redirect:'/home',
    children:[
      {
        path:'/home',
        name:'home',
        component:()=>import('../views/home/index.vue')
      },
      {
        path:'/map',
        name:'map',
        component:()=>import('../views/map/index.vue')
      },
      {
        path:'/stat',
        name:'stat',
        component:()=>import('../views/stat/index.vue')
      },
      {
        path:'/more',
        name:'more',
        component:()=>import('../views/more/index.vue')
      },
    ]
  },

]

export const anyRoute=[
  {
    path:'/:pathMatch(.*)*',
    name:'notFound',
    component:()=>import('../views/404/index.vue')
  }
]
