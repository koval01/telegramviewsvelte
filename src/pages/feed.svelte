<script lang="ts">
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { Page, Navbar, NavLeft, NavTitle, NavRight, Icon } from 'framework7-svelte';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);

    export let channelId: string = "notcoin";

    let channel: any = {};
    let posts: any[] = [];
    let loading: boolean = true;

    let showPreloader = true;
    let allowInfinite = true;

    const loadMore = () => {
        if (!allowInfinite) return;
        allowInfinite = false;

        console.log("load next posts");

        setTimeout(async () => {
            try {
                const response = await axios.get(`https://tme.koval.page/v1/more/${channelId}`);
                posts = [...posts, ...response.data.content.posts.reverse()];
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching more posts:", error);
            } finally {
                allowInfinite = true; // Reset to allow more loads
            }
        }, 1000);
    }

    onMount(async () => {
        try {
            const response = await axios.get(`https://tme.koval.page/v1/body/${channelId}`);
            channel = response.data.channel;
            posts = response.data.content.posts.reverse();
        } catch (error) {
            console.error("Error fetching channel data:", error);
        } finally {
            loading = false;
        }
    });

    function formatDate(unixTimestamp: number) {
        const date = dayjs.unix(unixTimestamp);
        const now = dayjs();
        if (now.diff(date, 'hour') < 24) {
            return date.fromNow();
        }
        return date.format('MMM D');
    }
</script>

<Page infinite infiniteDistance={50} infinitePreloader={showPreloader} onInfinite={loadMore}>
    <Navbar>
        <NavLeft>
            {#if channel.avatar}
                <img class="w-8 h-8 rounded-full" src={channel.avatar} alt="Avatar" />
            {/if}
        </NavLeft>
        <NavTitle subtitle={channel.counters?.subscribers ? `${channel.counters?.subscribers} subscribers` : ''}>
            {channel.title ? channel.title : channelId}
        </NavTitle>
        <NavRight>
            <div></div>
        </NavRight>
    </Navbar>

    {#if !loading}
        <div class="md:mx-16 lg:mx-32 xl:mx-64 2xl:mx-[28vw] mt-8">
            {#each posts as post}
                <div class="px-4 {post.forwarded ? 'py-6' : 'py-3'} bg-transparent first:border-none border-t border-solid border-neutral-700 relative hover:bg-neutral-900 transition-colors duration-200">
                    {#if post.forwarded}
                        <div class="flex absolute left-[3.25rem] top-1">
                            <Icon f7="arrow_turn_left_down" size="16px" class="text-neutral-400 top-1" />
                            <span class="text-neutral-400 ml-1">{post.forwarded.name}</span>
                        </div>
                    {/if}
                    <div class="flex">
                        <div class="flex mr-2 shrink-0 relative top-1">
                            <img class="w-12 h-12 rounded-full" src={channel.avatar} alt="Avatar" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <span class="mr-1 font-bold">{channel.title}</span>
                                <span class="mr-1 text-neutral-400">{channel.username}</span>
                                <span class="mr-1 text-neutral-400">·</span>
                                <span class="mr-1 text-neutral-400">{formatDate(post.footer.date.unix)}</span>
                            </div>
                            <div class="mb-3">
                                {#if post.content?.text?.html}
                                    {@html post.content.text.html}
                                {/if}
                                {#if post.content?.media && post.content.media.length > 0}
                                    {#each post.content.media as media}
                                        {#if media.type === 'image'}
                                            <img src={media.url} alt="Media" class="rounded-xl w-full {post.content?.text?.html ? 'mt-2' : ''}" draggable="false" />
                                        {:else if media.type.includes('roundvideo', 'video')}
                                            <video class="w-full {media.type === 'roundvideo' ? 'rounded-full' : 'rounded-xl'} {post.content?.text?.html ? 'mt-2' : ''}" poster={media.thumb} controls muted preload="auto">
                                                <source src={media.url} type="video/mp4">
                                                <track src={null} kind="captions" />
                                                Your browser does not support the video element.
                                            </video>
                                        {:else if media.type === 'voice'}
                                            <audio controls>
                                                <source src={media.url} type="audio/ogg">
                                                Your browser does not support the audio element.
                                            </audio>
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        </div>
                        <div class="text-sm text-neutral-400">
                            <span>
                                <Icon f7="eye_fill" size="16px" class="!align-baseline" />
                                {post.footer.views}
                            </span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</Page>
