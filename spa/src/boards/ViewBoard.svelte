<script>
  import Paper, { Title, Subtitle, Content } from '@smui/paper'
  import Button, { Label } from '@smui/button'
  import { Icon } from '@smui/icon-button'
  import { fieldid, field } from '../stores/viewboard.js'
  import { state } from '../stores/appstate.js'
  import WebSocket from '../helpers/websocket.js'
  import { onMount, onDestroy } from 'svelte'

  const ws = new WebSocket()

  ws.onmessage((data) => {
    if (data.action == 'response:state') {
      field.set(data.state)
    }
  })

  ws.onopen(() => {
    ws.send({
      'request': 'state'
    })
  })

  onMount(async () => {
    ws.open($fieldid, 'view')
  })

  onDestroy(() => {
    if (ws.isOpen) ws.close()
  })

  function back() {
    state.set('')
  }
</script>

<div class="viewboard">
  {#if $state == 'view'}
  <div class='controls flex'>
    <Button variant='unelevated' color='primary' on:click={back}>
      <Label>Back</Label>
    </Button>
  </div>
  {/if}
  <div class={'fields state-' + $state}>
    <div class='line'>
      <div class='square'><span class='inner'></span></div>
      <div class='square'><span class='inner'>A</span></div>
      <div class='square'><span class='inner'>B</span></div>
      <div class='square'><span class='inner'>C</span></div>
      <div class='square'><span class='inner'>D</span></div>
      <div class='square'><span class='inner'>E</span></div>
      <div class='square'><span class='inner'>F</span></div>
      <div class='square'><span class='inner'>G</span></div>
      <div class='square'><span class='inner'>H</span></div>
      <div class='square'><span class='inner'>I</span></div>
      <div class='square'><span class='inner'>J</span></div>
    </div>
    {#each $field as line, rowIdx}
      <div class='line'>
        <div class='square'><span class='inner'>{rowIdx + 1}</span></div>
        {#each line as square, colIdx}
          <div class='square'>
            <span row={rowIdx} col={colIdx} class='inner'>
              {#if square == 'o'}
                <Icon class="material-icons color-red">whatshot</Icon>
              {:else if square == '#o'}
                <Icon class="material-icons color-light-blue">directions_boat</Icon>
                <Icon class="material-icons color-red">whatshot</Icon>
              {/if}
            </span>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .fields {
    font-size: 1rem;
  }

  .fields.state-obs {
    margin: 0px;
  }

  .line {
    display: flex;
  }

  .square {
    color: black;
    background-color: white;
    flex: 1 0 auto;
    position: relative;
    margin: 1px;
  }

  .square:after {
    content: '';
    float: left;
    display: block;
    padding-top: 100%;
  }

  .square .inner {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }

  .controls {
    justify-content: center;
  }
</style>
