<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { scheduleItemsByWeekdays } from './schedule-store';

    let lastHighlightedId: string;

    let hasItems = false;
    $: hasItems = !$scheduleItemsByWeekdays.every(
        (itemsOfWeekday) => itemsOfWeekday.length === 0
    );

    const highlightToday = () => {
        if (hasItems) {
            // Transform day so that 0 is Monday and 6 Sunday
            let day = new Date().getDay() - 1;
            if (day === -1) {
                day = 6;
            }
            const newId = 'weekday-header-' + day;
            if (newId === lastHighlightedId) {
                return;
            }
            if (lastHighlightedId) {
                document
                    .getElementById(lastHighlightedId)
                    .classList.remove('highlighted');
            }
            document.getElementById(newId).classList.add('highlighted');
            lastHighlightedId = newId;
        }
    };

    onMount(() => {
        highlightToday();
        // Highlight new day when app is open when day changes
        window.addEventListener('focus', highlightToday);
        return () => window.removeEventListener('focus', highlightToday);
    });
</script>

{#if !hasItems}
    <p class="add-hint">Füge erst etwas hinzu</p>
{:else}
    <table>
        <thead>
            <tr>
                <th id="weekday-header-0">Montag</th>
                <th id="weekday-header-1">Dienstag</th>
                <th id="weekday-header-2">Mittwoch</th>
                <th id="weekday-header-3">Donnerstag</th>
                <th id="weekday-header-4">Freitag</th>
                <th id="weekday-header-5">Samstag</th>
                <th id="weekday-header-6">Sonntag</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                {#each $scheduleItemsByWeekdays as itemsOfWeekday, idx (idx)}
                    <td>
                        {#each itemsOfWeekday as { id, name, color: { red, green, blue } } (id)}
                            <div class="item" transition:fade>
                                <span
                                    style={`background-color: rgb(${red}, ${green}, ${blue});`}
                                />{name}
                            </div>
                        {/each}
                    </td>
                {/each}
            </tr>
        </tbody>
    </table>
{/if}

<style>
    .add-hint {
        text-align: center;
        font-size: 1.125rem;
        margin: 16px 0;
    }

    .item {
        display: flex;
        align-items: center;
    }

    .item > span {
        flex-shrink: 0;
        border-radius: 50%;
        height: 12px;
        width: 12px;
        margin-right: 4px;
    }

    th {
        padding: 4px 8px;
        border-radius: 4px;
    }

    /* Do not purge dynamically added class */
    :global(th.highlighted) {
        background-color: lightskyblue;
    }
</style>
