<script lang="ts" context="module">
    // Variables in context module aren't reactive
    let inputSuffix = 1;
</script>

<script lang="ts">
    inputSuffix++;
    const step = 5;

    const randomInt = () =>
        Math.round(Math.random() * Math.floor(255 / step)) * step;

    export const randomize = () => {
        rVal = randomInt();
        gVal = randomInt();
        bVal = randomInt();
    };

    export let rVal: number = -1;
    export let gVal: number = -1;
    export let bVal: number = -1;

    if (rVal === -1 || gVal === -1 || bVal === -1) {
        randomize();
    }
</script>

<div class="color-picker">
    <div
        class="color-indicator"
        style={`background-color: rgb(${rVal}, ${gVal}, ${bVal});`}
    />
    <div class="control">
        <label for={'rVal-input' + inputSuffix}>Rot</label>
        <input
            id={'rVal-input' + inputSuffix}
            type="range"
            min="0"
            max="255"
            {step}
            bind:value={rVal}
        />
    </div>
    <div class="control">
        <label for={'gVal-input' + inputSuffix}>Grün</label>
        <input
            id={'gVal-input' + inputSuffix}
            type="range"
            min="0"
            max="255"
            {step}
            bind:value={gVal}
        />
    </div>
    <div class="control">
        <label for={'bVal-input' + inputSuffix}>Blau</label>
        <input
            id={'bVal-input' + inputSuffix}
            type="range"
            min="0"
            max="255"
            {step}
            bind:value={bVal}
        />
    </div>
</div>

<style>
    .color-picker {
        display: flex;
        flex-direction: column;
        width: 240px;
        margin: 0 auto;
        text-align: center;
    }

    .color-indicator {
        width: 100%;
        height: 32px;
        margin-bottom: 8px;
    }

    .control,
    .control > input {
        width: 100%;
    }
</style>
