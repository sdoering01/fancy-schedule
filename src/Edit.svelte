<script lang="ts">
    import {
        scheduleItems,
        weekdayKeys,
        ScheduleItem,
        Weekday
    } from './schedule-store';
    import ColorPicker from './ColorPicker.svelte';

    let show = false;
    let nameInput = '';
    let selectedItemIdx: number;
    let selectedItem: ScheduleItem | undefined;
    $: selectedItem = $scheduleItems[selectedItemIdx];

    let randomizeColorPicker: () => void;
    let rValNew: number;
    let gValNew: number;
    let bValNew: number;

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        const trimmedInput = nameInput.trim();
        if (!trimmedInput) {
            return;
        }
        scheduleItems.add(trimmedInput, {
            red: rValNew,
            green: gValNew,
            blue: bValNew
        });
        nameInput = '';
        randomizeColorPicker();
        selectedItemIdx = $scheduleItems.length - 1;
    };

    const handleCheckboxChange = (weekday: Weekday) => {
        scheduleItems.toggleWeekday(selectedItem.id, weekday);
    };

    const handleDelete = () => {
        scheduleItems.remove(selectedItem.id);
        selectedItemIdx = 0;
    };
</script>

<!-- Hide like this so the state is preserved -->
<div class="container">
    <button on:click={() => (show = !show)}>Bearbeiten</button>
    <div class:hidden={!show}>
        <form on:submit={handleSubmit}>
            <h3>Hinzufügen</h3>
            <div class="form-control">
                <label for="name-input">Name</label><br />
                <input id="name-input" type="text" bind:value={nameInput} />
            </div>
            <ColorPicker
                bind:rVal={rValNew}
                bind:gVal={gValNew}
                bind:bVal={bValNew}
                bind:randomize={randomizeColorPicker}
            />
            <button type="submit">Hinzufügen</button>
        </form>
        {#if $scheduleItems.length > 0}
            <hr />
            <div class="edit-section">
                <h3>Bearbeiten</h3>
                <select bind:value={selectedItemIdx}>
                    {#each $scheduleItems as item, itemIdx (item.id)}
                        <option value={itemIdx}>{item.name}</option>
                    {/each}
                </select>
                {#if selectedItem}
                    <div>
                        {#each weekdayKeys as weekdayKey (weekdayKey)}
                            <input
                                type="checkbox"
                                checked={selectedItem.weekdays.includes(
                                    Weekday[weekdayKey]
                                )}
                                on:change={handleCheckboxChange.bind(
                                    null,
                                    Weekday[weekdayKey]
                                )}
                            />
                        {/each}
                    </div>
                    <ColorPicker
                        bind:rVal={$scheduleItems[selectedItemIdx].color.red}
                        bind:gVal={$scheduleItems[selectedItemIdx].color.green}
                        bind:bVal={$scheduleItems[selectedItemIdx].color.blue}
                    />
                    <button on:click={handleDelete}>Löschen</button>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .container {
        max-width: 240px;
        width: 100%;
        margin: 16px auto 0;
        text-align: center;
    }

    .container > button {
        width: 100%;
        padding: 4px;
        font-size: 1.125rem;
        margin-bottom: 16px;
    }

    .container > div > hr {
        margin: 16px 0;
    }

    .hidden {
        display: none;
    }

    form,
    .edit-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    h3 {
        margin: 0;
    }

    .form-control {
        width: 100%;
    }

    #name-input {
        min-width: 0;
        width: 100%;
    }
</style>
