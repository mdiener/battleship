<script>
  import Textfield from '@smui/textfield'
  import Button, {Label} from '@smui/button'
  import Paper, {Title, Subtitle, Content} from '@smui/paper'
  import Card, {Content as CardContent, PrimaryAction, Actions} from '@smui/card'
  import { state } from './stores/appstate.js'
  import { fieldid } from './stores/viewboard.js'
  import GameBoard from './boards/GameBoard.svelte'
  import ViewBoard from './boards/ViewBoard.svelte'
  import { onMount, onDestroy } from 'svelte'

  onMount(async () => {
    let search = document.location.search
    if (search != '') {
      const args = search.substr(1).split('&')
      const options = {
        'id': null,
        'obs': false
      }
      args.forEach((arg) => {
        const [ key, value ] = arg.split('=')
        if (key == 'id') options.id = value
        if (key == 'obs') options.obs = true
      })

      if (options.id != null) {
        $fieldid = options.id
        if (options.obs) {
          $state = 'obs'
        } else {
          $state = 'view'
        }
      }
    }
  })

  function viewGame() {
    state.set('view')
  }

  function playGame() {
    state.set('game')
  }
</script>

<main class={'state-' + $state}>
  {#if $state == ''}
    <div class="header">
      <h1>Battleship!</h1>
      <p>Enter your view board code to view someone else's board or select game board to continue or start a new game.</p>
    </div>
    <div>
      <Card class='view-game'>
        <CardContent>
          <Textfield bind:value={ $fieldid } type="text" label="View Code" variant="outlined" />
        </CardContent>
        <Actions fullBleed>
          <Button on:click={viewGame}>
            <Label>View Board</Label>
            <i class='material-icons' aria-hidden='true'>arrow_forward</i>
          </Button>
        </Actions>
      </Card>
      <Card class='play-game'>
        <Actions fullBleed>
          <Button on:click={playGame}>
            <Label>Game Board</Label>
            <i class='material-icons' aria-hidden='true'>arrow_forward</i>
          </Button>
        </Actions>
      </Card>
    </div>
  {:else if $state == 'game'}
    <GameBoard />
  {:else if $state == 'view' || $state == 'obs'}
    <ViewBoard />
  {/if}
</main>
<footer>

</footer>

<style>
  main {
    width: 100%;
    height: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
    background-color: #f8f8f8;

    padding: 20px;
  }

  main.state-obs {
    padding: 0px;
    max-width: 100%;
    background-color: rgba(0, 0, 0, 0);
  }

  .header {
    margin-bottom: 20px;
  }

  .header h1 {
    text-align: center;
    margin: 0px;
    margin-bottom: 10px;
  }

  .header p {
    margin: 0px;
  }
</style>
