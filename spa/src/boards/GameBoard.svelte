<script>
  import Textfield from '@smui/textfield'
  import Paper, {Title, Subtitle, Content} from '@smui/paper'
  import Card, {Content as CardContent} from '@smui/card'
  import Button, {Group, Label} from '@smui/button'
  import { Icon } from '@smui/icon-button'
  import { field, hasShips, state as boardstate, fieldid } from '../stores/gameboard.js'
  import { state } from '../stores/appstate.js'
  import WebSocket from '../helpers/websocket.js'
  import { onMount, onDestroy } from 'svelte'

  const ws = new WebSocket()

  ws.onmessage((data) => {
    if (data.action == 'request:state') {
      ws.send({
        data: $field
      })
    }
  })

  onMount(async () => {
    ws.open($fieldid, 'game')
  })

  onDestroy(() => {
    if (ws.isOpen) ws.close()
  })

  function newGame() {
    $boardstate = 'new'
    field.reset()
    fieldid.new()

    if (ws.isOpen) ws.close()
    ws.open($fieldid, 'game')
  }

  function back() {
    state.set('')
  }

  function squareClicked(event) {
    const col = Number(event.currentTarget.getAttribute('col'))
    const row = Number(event.currentTarget.getAttribute('row'))

    if ($boardstate == 'placing') {
      if ($field[row][col] == '#') {
        field.setSquare(row, col, '')
      } else {
        field.setSquare(row, col, '#')
      }
    } else if ($boardstate == 'playing') {
      switch ($field[row][col]) {
        case '':
          field.setSquare(row, col, 'o')
          break
        case '#':
          field.setSquare(row, col, '#o')
          break
        case 'o':
          field.setSquare(row, col, '')
          break
        case '#o':
          field.setSquare(row, col, '#')
          break
        default:
          break;
      }
    }

    if (ws.isOpen) {
      ws.send({
        data: $field
      })
    }
  }
</script>

<div class="gameboard">
  <div class='flex space-between'>
    <Button variant='unelevated' color='primary' on:click={newGame}>
      <Label>New</Label>
    </Button>
    <Group>
      <Button variant='unelevated' color='primary' on:click={() => $boardstate = 'placing'} disabled={$boardstate == 'playing'}><Label>Ships</Label></Button>
      <Button variant='unelevated' color='primary' on:click={() => $boardstate = 'playing'} disabled={!$hasShips}><Label>Start</Label></Button>
    </Group>
    <Button variant='unelevated' color='primary' on:click={back}>
      <Label>Back</Label>
    </Button>
  </div>
  <div class='actions'>
    {#if $boardstate == 'new'}
      <p>New game started. Click on Ships to start placing ships.</p>
    {:else if $boardstate == 'placing'}
      <p>Place ships in the squares. Once done click on start to start playing.</p>
    {:else}
      <p>Click on a square to mark it as shot at.</p>
    {/if}
  </div>
  <div class={'fields state-' + $boardstate}>
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
            <span on:click={squareClicked} row={rowIdx} col={colIdx} class='inner'>
              {#if square == '#'}
                <Icon class="material-icons color-blue">directions_boat</Icon>
              {:else if square == 'o'}
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
  <div class='fieldid'>
    <Card>
      <CardContent>
        <p>Provide this ID for others to view your board.</p>
        <Textfield value={$fieldid} variant="outlined"></Textfield>
      </CardContent>
    </Card>
  </div>
</div>

<style>
  .fields {
    margin: 0 auto;
    font-size: 1rem;
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

  .fieldid {
    color: black;
    margin-top: 20px;
  }
</style>
