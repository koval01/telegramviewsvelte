<script lang="ts">
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { Page, Navbar, NavLeft, NavTitle, NavRight, Block, Icon } from 'framework7-svelte';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);

    export let channelId: string;

    let channel: any = {};
    let posts: any[] = [];
    let loading: boolean = true;

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

<style>
    .tweet-header .dot {
        margin-right: .3rem;
        font-size: 2rem;
        line-height: 0;
        bottom: .15rem;
        position: relative;
    }
    .tweet-footer {
        font-size: .9rem;
        color: #8899a6; /* Lighter color for text in dark theme */
    }
</style>

<Page>
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

    {#if loading}
        <Block>
            <p>Loading...</p>
        </Block>
    {:else}
        <div class="md:mx-12 lg:mx-24 xl:mx-48 2xl:mx-96 mt-8">
            {#each posts as post}
                <div class="flex p-4 bg-transparent first:border-none border-t border-solid border-zinc-700">
                    <div class="mr-4">
                        <img class="w-12 h-12 rounded-full" src={channel.avatar} alt="Avatar" />
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <span class="author-name mr-1 font-bold">{channel.title}</span>
                            <span class="username mr-1 text-gray-400">{channel.username}</span>
                            <span class="dot mr-1 text-gray-400">·</span>
                            <span class="tweet-time mr-1 text-gray-400">{formatDate(post.footer.date.unix)}</span>
                        </div>
                        <div class="mb-3">
                            {#if post.content?.text?.html}
                                {@html post.content.text.html}
                            {/if}
                            {#if post.content?.media && post.content.media.length > 0}
                                {#each post.content.media as media}
                                    {#if media.type === 'image'}
                                        <img src={media.url} alt="Media" class="rounded-xl w-full {post.content?.text?.html ? 'mt-2' : ''}" draggable="false" />
                                    {/if}
                                {/each}
                            {/if}
                        </div>
                        <div class="tweet-footer">
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
