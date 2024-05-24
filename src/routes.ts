import Home from './pages/home.svelte'

import NotFound from './pages/404.svelte'

export default [
    {
        path: '/:channelId',
        component: Home,
    },
    {
        path: '(.*)',
        component: NotFound,
    },
]
