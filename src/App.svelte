<script>
    import { App, View } from 'framework7-svelte'
    import routes from './routes'

    import 'framework7/css/bundle'
    import 'framework7-icons'

    import './telegram.css'

    const f7Params = {
        theme: "ios",
        darkMode: "dark",
        routes,
        popup: {
            closeOnEscape: true,
        },
        sheet: {
            closeOnEscape: true,
        },
        popover: {
            closeOnEscape: true,
        },
        actions: {
            closeOnEscape: true,
        },
    }
</script>

<App {...f7Params}>
    <View
            url={location.pathname}
            main={true}
            class="safe-areas"
            masterDetailBreakpoint={768}
            browserHistory={true}
            browserHistoryRoot=''
            preloadPreviousPage={true}
            iosSwipeBack={true}
    />
</App>