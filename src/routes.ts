import Feed from './pages/feed.svelte'

import NotFound from './pages/404.svelte'

export default [
    {
        path: '/',
        component: Feed,
    },
    {
        path: '/:channelId',
        component: Feed,
    },
    {
        path: '(.*)',
        component: NotFound,
    },
]
