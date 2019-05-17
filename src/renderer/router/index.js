import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: require('@/components/ApplicationPage').default,
    meta: {
      icon: 'dashboard',
      settingsName: 'home'
    }
  },
  {
    path: '/social',
    component: require('@/components/SocialPage').default,
    meta: {
      icon: 'account_box',
      settingsName: 'social'
    },
    children: [
      {
        path: 'dashboard',
        component: require('@/components/SocialPage/SocialHome').default,
        meta: {
          icon: 'dashboard',
          settingsName: 'socialDashboard'
        }
      },
      {
        path: 'facebook',
        component: require('@/components/SocialPage/Facebook').default,
        meta: {
          icon: 'fab fa-facebook-square',
          settingsName: 'facebook'
        }
      },
      {
        path: 'twitter',
        component: require('@/components/SocialPage/Twitter').default,
        meta: {
          icon: 'fab fa-twitter-square',
          settingsName: 'twitter'
        }
      },
      {
        path: 'snapchat',
        component: require('@/components/SocialPage/Snapchat').default,
        meta: {
          icon: 'fab fa-snapchat-square',
          settingsName: 'snapchat'
        }
      }
    ]
  },
  {
    path: '/pids',
    component: require('@/components/PidPage').default,
    meta: {
      icon: 'list',
      settingsName: 'pids'
    },
    children: [
      { 
        path: 'dashboard',
        component: require('@/components/PidPage/PidHome').default,
        meta: {
          icon: 'dashboard',
          settingsName: 'pidsDashboard'
        }
      },
      {
        path: 'ctc',
        component: require('@/components/PidPage/ClickToCall').default,
        meta: {
          icon: 'phonelink_ring',
          settingsName: 'ctc'
        }
      },
      {
        path: 'bau',
        component: require('@/components/PidPage/BauCampaign').default,
        meta: {
          icon: 'filter_none',
          settingsName: 'bau'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/',
  },
];
export default new VueRouter({
  routes,
});

export function getRoutes() {
  const menu = {};
  /* eslint-disable array-callback-return */
  routes.map((route) => {
    if (!route.children) return
    const key = route.path.replace(/\/:id/g, '').replace(/\//g, '');
    menu[key] = [];
    /* eslint-disable array-callback-return */
    route.children.map((child) => {
      if (child.path === "" || child.path === "/") return
      menu[key].push({ 
        name: child.path.charAt(0).toUpperCase() + child.path.slice(1), 
        icon: child.meta.icon, 
        path: `${route.path}/${child.path}`
      })
    })
  })
  return menu;
}

export function getAllRoutes() {
  const menu = [];
  routes.map((route) => {
    if(!route.meta) return
    menu.push(route.meta.settingsName);
    if(route.children) {
      route.children.map(childRoute => {
        menu.push(childRoute.meta.settingsName);
      })
    }
  })
  return menu;
}