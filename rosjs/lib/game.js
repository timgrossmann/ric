/* global log */
const HIT_TIMEOUT = 10 // s
class GameState {
  constructor (cobot) {
    this.states = ['STANDBY',
      'MOVE_1', 'WAIT_FOR_HIT_1', 'HIT_1',
      'MOVE_2', 'WAIT_FOR_HIT_2', 'HIT_2',
      'MOVE_3', 'WAIT_FOR_HIT_3', 'HIT_3',
      'ERROR'
    ]

    this.transitionState('STANDBY')
    this.reactionTimeSum = 0
    this.poseStartMs = null
    this.hitTimeoutTimer = null
    this.cobot = cobot
  }
  transitionState (targetState) {
    this.transitionState(targetState)
    this.execState()
  }
  startTimeout () {
    this.hitTimeoutTimer = setTimeout(() => this.timeoutDetected(this.currentState), HIT_TIMEOUT * 1000) // s -> ms
  }
  // state actions
  execState () {
    switch (this.currentState) {
      case 'STANDBY':
        break
      case 'MOVE_1':
        this.cobot.moveToPose(0) // lol IT
        break
      case 'WAIT_FOR_HIT_1':
        this.startTimeout()
        this.poseStartMs = new Date()
        break
      case 'HIT_1':
        this.reactionTimeSum += new Date() - this.poseStartMs
        break
      case 'MOVE_2':
        this.cobot.moveToPose(1)
        break
      case 'WAIT_FOR_HIT_2':
        this.startTimeout()
        this.poseStartMs = new Date()
        break
      case 'HIT_2':
        this.reactionTimeSum += new Date() - this.poseStartMs
        break
      case 'MOVE_3':
        this.cobot.moveToPose(2)
        break
      case 'WAIT_FOR_HIT_3':
        this.startTimeout()
        this.poseStartMs = new Date()
        break
      case 'HIT_3':
        this.reactionTimeSum += new Date() - this.poseStartMs
        break
    }
  }
  // events
  collissionDetected () {
    switch (this.currentState) {
      case 'WAIT_FOR_HIT_1':
        this.transitionState('HIT_1')
        break

      case 'WAIT_FOR_HIT_2':
        this.transitionState('HIT_2')
        break

      case 'WAIT_FOR_HIT_3':
        this.transitionState('HIT_3')
        break
      default:
        this.transitionState('ERROR')
    }
  }

  timeoutDetected () {
    switch (this.currentState) {
      case 'WAIT_FOR_HIT_1':
        this.transitionState('ERROR')
        break

      case 'WAIT_FOR_HIT_2':
        this.transitionState('ERROR')
        break

      case 'WAIT_FOR_HIT_3':
        this.transitionState('ERROR')
        break

      default:
        console.log('Unhandled timeout', {state: this.currentState})
    }
  }

  reachedPose () {
    switch (this.currentState) {
      case 'MOVE_1':
        this.transitionState('WAIT_FOR_HIT_1')
        break

      case 'MOVE_2':
        this.transitionState('WAIT_FOR_HIT_2')
        break

      case 'MOVE_3':
        this.transitionState('WAIT_FOR_HIT_3')
        break

      default:
        log.warn('Unhandled timeout', {state: this.currentState})
    }
  }
}

module.exports = GameState
