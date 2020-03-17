import { mount } from '@vue/test-utils'
import BoardView from '@/components/BoardView.vue'
import GameBoard from '@/GameBoard.js'

describe('Board in Building Phase', () => {
  const board = GameBoard();
  const start = { x: 0, y: 0 }
  const end = { x: 0, y: 3 }
  board.newShip({ start: start, end: end, size: 4 });

  const wrapper = mount(BoardView, {
    propsData: {
      isSetup: true,
      attackable: false,
      buildTargets: board.buildTargets(),
      cols: board.readOut,
      selected: {x: -1, y: -1},
    }
  })

  test('renders 2d cells array into div.cell', () => {
    expect(wrapper.findAll('.col').length).toBe(10);
    expect(wrapper.findAll('.cell').length).toBe(100);
  });

  test('renders build targets on empty cells', () => {
    expect(wrapper.findAll('.target').length).toBe(96);
  });

  test('clicking on build target', () => {
    const target = wrapper.find('#b2-1');
    target.trigger('click');
    expect(wrapper.emitted().build).toBeTruthy();
    const payload = wrapper.emitted().build[0][0];
    expect(payload.x).toBe(2);
    expect(payload.y).toBe(1);
  });

});

describe('Board in attack phase', () => {
  const board = GameBoard();
  const start = { x: 0, y: 0 }
  const end = { x: 0, y: 3 }
  board.newShip({ start: start, end: end, size: 4 });

  const propsData = {
    isSetup: false,
    attackable: true,
    buildTargets: [],
    cols: board.readOut,
    selected: {x: -1, y: -1},
  }

  test('renders attack targets on empty', () => {
    const wrapper = mount(BoardView, { propsData });
    expect(wrapper.findAll('.target').length).toBe(100);
  });

  test('updates attack targets after attack', () => {
    board.attack({x: 0, y: 0});
    const wrapper = mount(BoardView, { propsData });
    expect(wrapper.findAll('.target').length).toBe(99);
    expect(wrapper.find('#c0-0').text()).toBe('x');
  });
});