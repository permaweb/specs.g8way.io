import { createMachine, state, transition, invoke, reduce } from 'robot3';

import { useMachine } from 'svelte-robot-factory';
import Api from '../lib'
import services from '../services'

const api = Api.init(services)

const machine = createMachine({
  idle: state()
})

const service = useMachine(machine, () => null);
export default service;